export type ChannelType =
  | "whatsapp"
  | "email"
  | "linkedin"
  | "instagram"
  | "telegram"
  | "webchat";

export interface ChannelIdentity {
  channel: ChannelType;
  handle: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  country: string;
  avatarInitials: string;
  identities: ChannelIdentity[];
}

export interface Message {
  id: string;
  threadId: string;
  channel: ChannelType;
  direction: "inbound" | "outbound";
  author: string;
  body: string;
  timestamp: string;
  deliveryStatus?: "sent" | "delivered" | "read" | "failed";
}

export interface Thread {
  id: string;
  contact: Contact;
  shipmentRef?: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  channelsInThread: ChannelType[];
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  role: string;
  country: string;
  commodity: string;
  matchScore: number;
  source: "linkedin" | "email-signature" | "trade-directory" | "manual";
  sourceUrl?: string;
  summary: string;
}

export interface ChatbotTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  prospects?: Prospect[];
}
