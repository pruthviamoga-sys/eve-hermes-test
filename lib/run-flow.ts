import { appendFileSync } from "node:fs";

type FlowStep = {
  id: string;
  type: string;
  url?: string;
  enabled?: boolean;
  prompt?: string;
  input?: string;
};
type Flow = { name: string; steps: FlowStep[] };

export async function runFlow(flow: Flow) {
  const values: Record<string, unknown> = {};
  const log = (id: string, status: string, detail: string) =>
    appendFileSync(
      "flow-runs.log",
      `${new Date().toISOString()} ${flow.name} ${id} ${status} ${detail}\n`,
    );

  for (const step of flow.steps) {
    try {
      if (step.type === "fetch") {
        const res = await fetch(step.url!);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        values[step.id] = await res.json();
        log(step.id, "ok", "fetched");
      } else if (step.type === "ai") {
        values[step.id] = values[step.input!]; // pass data through until AI is wired
        log(step.id, "skipped", step.enabled === false ? "AI disabled" : "AI not wired yet");
      } else if (step.type === "save") {
        appendFileSync(
          "flow-results.log",
          JSON.stringify({ at: new Date().toISOString(), flow: flow.name, data: values[step.input!] ?? null }) + "\n",
        );
        log(step.id, "ok", "saved");
      }
    } catch (err) {
      log(step.id, "failed", err instanceof Error ? err.message : String(err));
      return;
    }
  }
}