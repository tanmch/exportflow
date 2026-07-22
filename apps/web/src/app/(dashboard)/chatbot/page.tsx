import type { Metadata } from "next";
import { ChatbotWorkspace } from "@/components/chatbot/chatbot-workspace";
import { initialChatbotTurns } from "@/lib/mock-chatbot";

export const metadata: Metadata = {
  title: "Chatbot — ExportFlow",
};

export default function ChatbotPage() {
  return <ChatbotWorkspace initialTurns={initialChatbotTurns} />;
}
