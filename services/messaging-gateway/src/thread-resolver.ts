import type { ChannelIdentity, NormalizedMessage } from "@exportflow/shared-types";

export interface ThreadResolverDeps {
  findContactByIdentity(identity: ChannelIdentity): Promise<{ contactId: string } | null>;
  createShadowContact(identity: ChannelIdentity): Promise<{ contactId: string }>;
  findOrCreateThread(contactId: string, channel: NormalizedMessage["channel"]): Promise<{ threadId: string }>;
  requestEnrichment(contactId: string): Promise<void>;
}

/**
 * Consumer Kafka `message.received` (lihat docs/ARCHITECTURE.md §4.1 langkah 3):
 * mencocokkan ChannelIdentity pengirim ke Contact yang sudah ada, atau membuat
 * shadow contact dan memicu enrichment RAG secara async bila belum dikenal.
 */
export async function resolveThreadForMessage(
  message: NormalizedMessage,
  deps: ThreadResolverDeps
): Promise<{ threadId: string; contactId: string }> {
  const identity: ChannelIdentity = { channel: message.channel, handle: message.authorHandle };

  const existing = await deps.findContactByIdentity(identity);
  const contact = existing ?? (await deps.createShadowContact(identity));

  if (!existing) {
    await deps.requestEnrichment(contact.contactId);
  }

  const thread = await deps.findOrCreateThread(contact.contactId, message.channel);
  return { threadId: thread.threadId, contactId: contact.contactId };
}
