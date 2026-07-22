import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { threads, messagesByThread } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Chat — ExportFlow",
};

export default function ChatPage() {
  return <ChatWorkspace threads={threads} messagesByThread={messagesByThread} />;
}
