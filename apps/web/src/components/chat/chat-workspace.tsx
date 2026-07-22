"use client";

import { useState } from "react";
import { ThreadList } from "./thread-list";
import { ThreadView } from "./thread-view";
import { ContextPanel } from "./context-panel";
import type { Message, Thread } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ChatWorkspace({
  threads,
  messagesByThread,
}: {
  threads: Thread[];
  messagesByThread: Record<string, Message[]>;
}) {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id ?? "");
  const [mobileShowConversation, setMobileShowConversation] = useState(false);
  const activeThread = threads.find((t) => t.id === activeThreadId);

  function handleSelect(threadId: string) {
    setActiveThreadId(threadId);
    setMobileShowConversation(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className={cn("h-full md:flex", mobileShowConversation ? "hidden" : "flex w-full md:w-auto")}>
        <ThreadList threads={threads} activeThreadId={activeThreadId} onSelect={handleSelect} />
      </div>

      {activeThread ? (
        <div className={cn("h-full min-w-0 flex-1 md:flex", mobileShowConversation ? "flex" : "hidden")}>
          <ThreadView
            thread={activeThread}
            messages={messagesByThread[activeThread.id] ?? []}
            onBack={() => setMobileShowConversation(false)}
          />
          <ContextPanel thread={activeThread} />
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-sm text-ink-faint md:flex">
          Pilih percakapan untuk mulai membalas.
        </div>
      )}
    </div>
  );
}
