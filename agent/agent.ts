import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  includeUsage: true,
});

export default defineAgent({
  model: openrouter("qwen/qwen3.5-flash-02-23"),
  modelContextWindowTokens: 64_000,
});