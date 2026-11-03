import { appendFileSync } from "node:fs";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

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
        if (step.enabled === false) {
          values[step.id] = values[step.input!];
          log(step.id, "skipped", "AI disabled");
        } else {
          const { text } = await generateText({
            model: openrouter("qwen/qwen3.5-flash-02-23"),
            prompt: `${step.prompt}\n\n${JSON.stringify(values[step.input!])}`,
          });
          const answer = text.includes("</think>") ? text.split("</think>").pop()! : text;
          values[step.id] = answer.trim();
          log(step.id, "ok", "summarized");
        }
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