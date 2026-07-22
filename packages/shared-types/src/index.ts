// Skema kanonis yang dipakai lintas service (api-gateway, messaging-gateway,
// ai-rag-service, workflow-service) dan frontend (apps/web).
// apps/web/src/lib/types.ts saat ini mendefinisikan copy lokal untuk kecepatan
// pengembangan UI; saat backend berjalan, keduanya disatukan lewat package ini.

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
  identities: ChannelIdentity[];
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  contactId: string;
  shipmentId?: string;
  channelsInThread: ChannelType[];
  createdAt: string;
  updatedAt: string;
}

export interface NormalizedMessage {
  id: string;
  threadId: string;
  channel: ChannelType;
  direction: "inbound" | "outbound";
  externalMessageId: string;
  authorHandle: string;
  body: string;
  attachments?: { url: string; contentType: string; filename: string }[];
  sentAt: string;
  deliveryStatus?: "sent" | "delivered" | "read" | "failed";
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
  provenance: {
    collectedAt: string;
    consentBasis: "public-professional-profile" | "manual-upload" | "existing-thread";
  };
}

// Nama event di Kafka/Redpanda — kontrak antar service (lihat docs/ARCHITECTURE.md §3-4).
export const EVENT_TOPICS = {
  MESSAGE_RECEIVED: "message.received",
  MESSAGE_SEND_REQUESTED: "message.send_requested",
  MESSAGE_DELIVERY_STATUS: "message.delivery_status",
  CONTACT_ENRICHMENT_REQUESTED: "contact.enrichment_requested",
  CONTACT_ENRICHED: "contact.enriched",
  DOCUMENT_DRAFTED: "document.drafted",
  DOCUMENT_FINALIZED: "document.finalized",
  INVOICE_PROJECTED: "invoice.projected",
} as const;
