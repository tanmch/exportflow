"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { ProspectCard } from "./prospect-card";
import { suggestedPrompts } from "@/lib/mock-chatbot";
import type { ChatbotTurn } from "@/lib/types";
import { sampleProspects } from "@/lib/mock-data";

export function ChatbotWorkspace({ initialTurns }: { initialTurns: ChatbotTurn[] }) {
  const [turns, setTurns] = useState<ChatbotTurn[]>(initialTurns);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const turnIdCounter = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, isThinking]);

  function nextTurnId(prefix: string) {
    turnIdCounter.current += 1;
    return `${prefix}-${turnIdCounter.current}`;
  }

  function sendPrompt(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userTurn: ChatbotTurn = { id: nextTurnId("u"), role: "user", content: trimmed };
    setTurns((prev) => [...prev, userTurn]);
    setDraft("");
    setIsThinking(true);

    window.setTimeout(() => {
      const assistantTurn: ChatbotTurn = {
        id: nextTurnId("a"),
        role: "assistant",
        content:
          "Ini contoh respons chatbot (data simulasi). Di produksi, jawaban ini dihasilkan lewat pencarian RAG atas data prospek terverifikasi dan histori percakapan Anda.",
        prospects: /cari|prospek|importir|buyer/i.test(trimmed) ? sampleProspects.slice(0, 2) : undefined,
      };
      setTurns((prev) => [...prev, assistantTurn]);
      setIsThinking(false);
    }, 700);
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-ink" strokeWidth={1.75} aria-hidden="true" />
          <h1 className="text-[15px] font-semibold text-ink">Chatbot</h1>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {turns.map((turn) => (
            <div key={turn.id} className="flex flex-col gap-3">
              <div
                className={
                  turn.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-ink px-3.5 py-2.5 text-sm leading-relaxed text-canvas"
                    : "max-w-[90%] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-ink"
                }
              >
                {turn.content}
              </div>

              {turn.prospects && turn.prospects.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {turn.prospects.map((prospect) => (
                    <ProspectCard key={prospect.id} prospect={prospect} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex max-w-[60%] items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2.5">
              <span className="sr-only">Chatbot sedang mengetik</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:300ms]" />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-3 md:p-4">
        <div className="mx-auto w-full max-w-2xl">
          {turns.length <= 2 && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendPrompt(prompt)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(draft);
            }}
          >
            <label className="sr-only" htmlFor="chatbot-input">
              Tanyakan sesuatu ke chatbot
            </label>
            <textarea
              id="chatbot-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendPrompt(draft);
                }
              }}
              rows={1}
              placeholder="Cari prospek, tempel link LinkedIn/email, atau minta ringkasan..."
              className="max-h-32 min-h-[42px] flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-ink text-canvas transition-opacity disabled:opacity-30"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
