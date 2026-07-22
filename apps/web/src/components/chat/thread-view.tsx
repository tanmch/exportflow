"use client";

import { useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { ChannelIcon, channelLabel } from "@/components/channel-icon";
import type { ChannelType, Message, Thread } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ThreadView({
  thread,
  messages,
  onBack,
}: {
  thread: Thread;
  messages: Message[];
  onBack?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [outboundChannel, setOutboundChannel] = useState<ChannelType>(
    thread.channelsInThread[thread.channelsInThread.length - 1]
  );

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:h-16 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="-ml-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:text-ink md:hidden"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Kembali ke daftar percakapan</span>
          </button>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs font-medium text-ink"
            aria-hidden="true"
          >
            {thread.contact.avatarInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{thread.contact.name}</p>
            <p className="truncate text-xs text-ink-muted">
              {thread.contact.role} · {thread.contact.company}
            </p>
          </div>
        </div>
        {thread.shipmentRef && (
          <span className="hidden shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted sm:inline-block">
            {thread.shipmentRef}
          </span>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 md:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="shrink-0 border-t border-border p-3 md:p-4">
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto" aria-label="Kirim balasan lewat channel">
          {thread.contact.identities.map((identity) => (
            <button
              key={identity.channel}
              type="button"
              onClick={() => setOutboundChannel(identity.channel)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                outboundChannel === identity.channel
                  ? "border-ink bg-ink text-canvas"
                  : "border-border text-ink-muted hover:border-border-strong"
              )}
              aria-pressed={outboundChannel === identity.channel}
            >
              <ChannelIcon channel={identity.channel} className="h-3.5 w-3.5" />
              {channelLabel(identity.channel)}
            </button>
          ))}
        </div>

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setDraft("");
          }}
        >
          <label className="sr-only" htmlFor="composer">
            Tulis pesan
          </label>
          <textarea
            id="composer"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            placeholder={`Balas via ${channelLabel(outboundChannel)}...`}
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            title="Minta draft balasan dari asisten AI"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Draft balasan dengan AI</span>
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-ink text-canvas transition-opacity disabled:opacity-30"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Kirim pesan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
