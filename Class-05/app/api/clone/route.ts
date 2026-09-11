import { NextResponse } from "next/server";
import { cloneSystemPrompt } from "../../../data/aiProfile";

// Increase Vercel function execution timeout (up to 60s)
export const maxDuration = 60;

const MODELS = [
  "inclusionai/ling-3.0-flash-fin:free",
  "nex-agi/nex-n2.5-mini:free",
  "liquid/lfm-2.5-2.6b:free",
];
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const safeMessages = messages
      .filter((message) =>
        (message?.role === "user" || message?.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
      )
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1200) }));

    if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please send a question about Atta." }, { status: 400 });
    }

    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.Open_Router_api_key ||
      process.env.OPEN_ROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "The AI clone is not configured on Vercel yet. Please add 'OPENROUTER_API_KEY' to your Vercel Project Settings -> Environment Variables, and redeploy.",
        },
        { status: 500 },
      );
    }

    const origin =
      request.headers.get("origin") ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://openrouter.ai");

    let lastError = "OpenRouter could not answer right now.";

    // Try models with fallback in case the free model is busy or rate-limited
    for (const model of MODELS) {
      try {
        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": origin,
            "X-Title": "Atta Ur Rehman AI Clone",
          },
          body: JSON.stringify({
            model,
            temperature: 0.25,
            max_tokens: 1200,
            messages: [{ role: "system", content: cloneSystemPrompt }, ...safeMessages],
          }),
        });

        const result = await response.json();

        if (response.ok && result?.choices?.[0]?.message?.content) {
          const answer = result.choices[0].message.content.trim();
          return NextResponse.json({ answer, model });
        }

        lastError = result?.error?.message || `Model ${model} returned status ${response.status}`;
        console.warn(`[Clone API] Attempt with ${model} failed:`, lastError);
      } catch (subErr) {
        console.warn(`[Clone API] Network issue with model ${model}:`, subErr);
      }
    }

    return NextResponse.json({ error: lastError }, { status: 502 });
  } catch (err) {
    console.error("[Clone API Critical Error]:", err);
    return NextResponse.json(
      { error: "The clone is temporarily unavailable. Please try again in a moment." },
      { status: 500 },
    );
  }
}
