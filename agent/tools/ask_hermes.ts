import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Send a task to the Hermes agent and return its answer.",
  inputSchema: z.object({ task: z.string().min(1) }),
  async execute({ task }) {
    const base = process.env.HERMES_API_URL;
    const key = process.env.HERMES_API_KEY;
    if (!base || !key) return { error: "HERMES_API_URL or HERMES_API_KEY is not set" };

    const res = await fetch(`${base.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "hermes-agent", messages: [{ role: "user", content: task }] }),
    });
    if (!res.ok) return { error: `Hermes returned ${res.status}` };

    const data = await res.json();
    return { answer: data.choices?.[0]?.message?.content ?? "" };
  },
});