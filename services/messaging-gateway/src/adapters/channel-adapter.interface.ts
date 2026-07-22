import type { ChannelType, NormalizedMessage } from "@exportflow/shared-types";

/**
 * Kontrak yang wajib dipenuhi setiap integrasi channel. Setiap adapter menerima payload
 * webhook mentah dari providernya masing-masing dan mengembalikan bentuk kanonis
 * `NormalizedMessage`, sehingga sisa sistem (thread resolver, UI, RAG indexer) tidak perlu
 * tahu perbedaan format WhatsApp vs Email vs LinkedIn.
 */
export interface ChannelAdapter {
  readonly channel: ChannelType;

  /** Validasi signature webhook dari provider (mis. X-Hub-Signature untuk Meta). */
  verifyWebhookSignature(rawBody: Buffer, headers: Record<string, string>): boolean;

  /** Ubah payload webhook mentah menjadi satu atau lebih NormalizedMessage. */
  normalizeInbound(payload: unknown): Promise<NormalizedMessage[]>;

  /** Kirim pesan keluar lewat provider ini; kembalikan externalMessageId untuk tracking status. */
  sendOutbound(message: {
    toHandle: string;
    body: string;
    attachments?: { url: string; contentType: string; filename: string }[];
  }): Promise<{ externalMessageId: string }>;
}
