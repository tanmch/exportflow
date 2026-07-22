import type { NormalizedMessage } from "@exportflow/shared-types";
import type { ChannelAdapter } from "./channel-adapter.interface";

/**
 * Adapter untuk WhatsApp Business Cloud API (Meta).
 * TODO Fase 2: implementasi nyata — verifikasi X-Hub-Signature-256, parsing payload
 * `messages` webhook, dan pengiriman via Graph API `/{phone-number-id}/messages`.
 */
export class WhatsappAdapter implements ChannelAdapter {
  readonly channel = "whatsapp" as const;

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
