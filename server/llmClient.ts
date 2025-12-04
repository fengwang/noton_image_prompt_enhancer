import OpenAI from "openai";
import { systemPrompt } from "./systemPrompt.js";
import { stripBeforeTag } from "./textFilter.js";

const defaultBaseUrl = process.env.PROMPT_ENHANCER_BASE_URL ?? "https://openrouter.ai/api/v1";
const defaultModel = process.env.PROMPT_ENHANCER_MODEL ?? "moonshotai/kimi-k2:free";
const envApiKey = process.env.PROMPT_ENHANCER_API_KEY;

export interface EnhanceOptions {
  baseUrl?: string;
  model?: string;
  apiKey?: string;
}

export async function enhance(prompt: string, opts?: EnhanceOptions): Promise<string> {
  const resolvedBaseUrl = opts?.baseUrl?.trim() || defaultBaseUrl;
  const resolvedModel = opts?.model?.trim() || defaultModel;
  const resolvedApiKey = opts?.apiKey?.trim() || envApiKey;

  if (!resolvedApiKey) {
    throw new Error("API key is missing. Provide PROMPT_ENHANCER_API_KEY or supply one in the request.");
  }

  const client = new OpenAI({
    apiKey: resolvedApiKey,
    baseURL: resolvedBaseUrl,
    timeout: 60_000
  });

  const response = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    top_p: 0.9
  });

  const content = response.choices?.[0]?.message?.content ?? "";
  return stripBeforeTag(content).trim();
}
