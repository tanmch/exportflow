import type { NormalizedMessage } from "@exportflow/shared-types";
import type { ChannelAdapter } from "./channel-adapter.interface";

/**
 * Adapter untuk LinkedIn. LinkedIn tidak menyediakan public messaging API resmi —
 * integrasi wajib lewat partner terverifikasi (mis. Unipile) yang legal untuk automasi
 * terbatas. JANGAN mengimplementasikan scraping langsung di sini.
 * TODO Fase 2: integrasi partner API, rate limit ketat per akun untuk menghindari flag.
 */
export class LinkedinAdapter implements ChannelAdapter {
  readonly channel = "linkedin" as const;

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
