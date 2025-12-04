import { EnhanceRequest, EnhanceResponse } from "../types";

export async function enhancePrompt(payload: EnhanceRequest): Promise<EnhanceResponse> {
  const response = await fetch("/api/enhance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as EnhanceResponse;
  if (!response.ok) {
    const message = data?.error ?? "Unable to enhance prompt";
    throw new Error(message);
  }

  return data;
}
