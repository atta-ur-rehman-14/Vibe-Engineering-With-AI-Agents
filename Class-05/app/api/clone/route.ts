import { NextResponse } from "next/server";
import { cloneSystemPrompt } from "../../../data/aiProfile";

const MODEL = "inclusionai/ling-3.0-flash-fin:free";
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
      return NextResponse.json({ error: "The clone is not configured yet. Add an OpenRouter key to .env." }, { status: 500 });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Atta Ur Rehman AI Clone",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.25,
        max_tokens: 1500,
        messages: [{ role: "system", content: cloneSystemPrompt }, ...safeMessages],
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error?.message || "OpenRouter could not answer right now." },
        { status: response.status },
      );
    }

    const answer = result?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ error: "The clone returned an empty answer. Try again." }, { status: 502 });
    }

    return NextResponse.json({ answer: answer.trim(), model: MODEL });
  } catch {
    return NextResponse.json({ error: "The clone is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
