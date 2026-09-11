"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { categorizedCloneQuestions, type SuggestedClonePrompt } from "../data/aiProfile";
import { ArrowUpRight } from "./Icons";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const introMessage: Message = {
  role: "assistant",
  content:
    "Hi, I am Atta's authentic AI clone powered by inclusionai/ling-3.0-flash-fin:free. Ask me anything about my data analytics journey, Python & SQL skills, social media management at Zyrom and PYNS, or my education at IAC and SMIT. I will answer strictly based on verified facts and suggest technical, research-based, or general questions you can explore.",
};

function extractSuggestedQuestions(text: string): string[] {
  const markerIndex = text.search(/you could ask[:\s]*/i);
  if (markerIndex === -1) return [];
  const textAfter = text.slice(markerIndex);
  const lines = textAfter.split("\n").slice(1);
  const questions: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;
    // Strip bullet marks: -, *, 1., 2., etc.
    line = line.replace(/^[\s*\-•\d.]+\s*/, "").trim();
    // Strip category prefixes like **Technical:** or [Technical]:
    line = line.replace(/^\[[^\]]+\]:?\s*/i, "").trim();
    line = line.replace(/^\*\*[^*]+?\*\*:\s*/i, "").trim();
    if (line.length >= 10 && (line.includes("?") || /^(what|how|why|can|could|tell|explain|walk)/i.test(line))) {
      questions.push(line);
    }
  }
  return questions.slice(0, 3);
}

export default function AICloneSection() {
  const [messages, setMessages] = useState<Message[]>([introMessage]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const askQuestion = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(1) }),
      });

      let content = "I could not answer that right now.";
      try {
        const result = await response.json();
        content = result.answer || result.error || content;
      } catch {
        content =
          response.status === 504
            ? "Request timed out on the server. Please try asking again."
            : `Error ${response.status}: Unable to get response from the clone.`;
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content,
        },
      ]);
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "The clone is temporarily unavailable. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askQuestion(question);
  };

  const handleReset = () => {
    if (loading) return;
    setMessages([introMessage]);
    setQuestion("");
  };

  return (
    <section className="clone-section" id="clone">
      <div className="shell">
        <div className="clone-heading">
          <div>
            <p className="section-kicker">/ 05 — Grounded AI Architecture</p>
            <h2>
              One profile.
              <br />
              <em className="gradient-text">Deterministic Intelligence.</em>
            </h2>
          </div>
          <div className="clone-status">
            <span className="telemetry-live-dot" /> grounded in Atta&apos;s verified facts
          </div>
        </div>

        <div className="clone-layout">
          <aside className="clone-sidebar">
            <div className="clone-sidebar-head">
              <p className="clone-sidebar-label">Curated Prompts</p>
              <span className="clone-count-tag">{categorizedCloneQuestions.length} topics</span>
            </div>
            <div className="clone-suggestions">
              {categorizedCloneQuestions.map((item) => (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => void askQuestion(item.question)}
                  disabled={loading}
                >
                  <div>
                    <span className={`clone-badge ${item.category.toLowerCase()}`}>{item.category}</span>
                    <span className="clone-suggestion-text">{item.question}</span>
                  </div>
                  <ArrowUpRight />
                </button>
              ))}
            </div>
            <p className="clone-note">
              Research-based, technical, or general questions are welcome — strictly grounded in Atta&apos;s verified work, education, and knowledge.
            </p>
          </aside>

          <div className="clone-panel">
            <div className="clone-panel-bar">
              <span>
                <i /> <i /> <i />
              </span>
              <span>atta_clone / live</span>
              <div className="clone-panel-model">
                <span className="clone-model-indicator" />
                <span>ling-3.0-flash-fin:free</span>
                {messages.length > 1 && (
                  <button
                    type="button"
                    className="clone-reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                    title="Reset conversation"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="clone-messages" aria-live="polite">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                const suggestedFollowUps = isAssistant ? extractSuggestedQuestions(message.content) : [];

                return (
                  <div className={`clone-message ${message.role}`} key={`${message.role}-${index}`}>
                    <span className="clone-message-label">{isAssistant ? "AR / clone (ling-3.0)" : "you"}</span>
                    <p>{message.content}</p>

                    {suggestedFollowUps.length > 0 && (
                      <div className="clone-inline-suggestions">
                        <span className="clone-inline-label">Interactive Follow-up Questions:</span>
                        <div className="clone-inline-chips">
                          {suggestedFollowUps.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              type="button"
                              className="clone-inline-chip"
                              onClick={() => void askQuestion(q)}
                              disabled={loading}
                            >
                              <span>{q}</span>
                              <ArrowUpRight />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="clone-message assistant">
                  <span className="clone-message-label">AR / clone (ling-3.0 thinking...)</span>
                  <p className="clone-typing">
                    <i />
                    <i />
                    <i />
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="clone-form" onSubmit={handleSubmit}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about Atta's technical skills, research, work experience, or education..."
                aria-label="Ask the AI clone a question"
                disabled={loading}
              />
              <button type="submit" aria-label="Send question" disabled={loading || !question.trim()}>
                <ArrowUpRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

