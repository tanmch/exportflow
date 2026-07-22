"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { ChannelIcon } from "@/components/channel-icon";
import type { Thread } from "@/lib/types";

export function ThreadList({
  threads,
  activeThreadId,
  onSelect,
}: {
  threads: Thread[];
  activeThreadId: string;
  onSelect: (threadId: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col border-r border-border md:w-80 lg:w-96">
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4 md:h-16">
        <h1 className="text-[15px] font-semibold text-ink">Chat</h1>
      </div>

      <div className="border-b border-border p-3">
        <label className="sr-only" htmlFor="thread-search">
          Cari percakapan
        </label>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden="true" />
          <input
            id="thread-search"
            type="text"
            placeholder="Cari kontak, perusahaan, atau shipment"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto" aria-label="Daftar percakapan">
        {threads.map((thread) => {
          const active = thread.id === activeThreadId;
          return (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => onSelect(thread.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors",
                  active ? "bg-surface-raised" : "hover:bg-surface-raised/60"
                )}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs font-medium text-ink"
                  aria-hidden="true"
                >
                  {thread.contact.avatarInitials}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-ink">
                      {thread.contact.name}
                    </span>
                    <span className="shrink-0 text-xs text-ink-faint">{thread.lastMessageAt}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-muted">
                    {thread.contact.company}
                    {thread.shipmentRef ? ` · ${thread.shipmentRef}` : ""}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className="line-clamp-1 flex-1 text-xs text-ink-muted">
                      {thread.lastMessagePreview}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span
                        className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-canvas"
                        aria-label={`${thread.unreadCount} pesan belum dibaca`}
                      >
                        {thread.unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5" aria-label="Channel dalam percakapan ini">
                    {thread.channelsInThread.map((channel) => (
                      <ChannelIcon key={channel} channel={channel} className="h-3.5 w-3.5 text-ink-faint" />
                    ))}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
