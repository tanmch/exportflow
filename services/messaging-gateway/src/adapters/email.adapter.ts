import type { NormalizedMessage } from "@exportflow/shared-types";
import type { ChannelAdapter } from "./channel-adapter.interface";

/**
 * Adapter untuk Email via Microsoft Graph API / Gmail API (push notification),
 * dengan fallback IMAP IDLE untuk provider generik.
 * TODO Fase 2: OAuth per-mailbox, parsing MIME multipart, thread matching via
 * In-Reply-To/References header.
 */
export class EmailAdapter implements ChannelAdapter {
  readonly channel = "email" as const;

  verifyWebhookSignature(_rawBody: Buffer, _headers: Record<string, string>): boolean {
    throw new Error("Not implemented — lihat TODO Fase 2 di file ini.");
  }

  async normalizeInbound(_payload: unknown): Promise<NormalizedMessage[]> {
    throw new Error("Not implemented — lihat TODO Fase 2 di file ini.");
  }

  async sendOutbound(_message: {
    toHandle: string;
    body: string;
    attachments?: { url: string; contentType: string; filename: string }[];
  }): Promise<{ externalMessageId: string }> {
    throw new Error("Not implemented — lihat TODO Fase 2 di file ini.");
  }
}
