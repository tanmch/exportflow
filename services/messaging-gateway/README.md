# messaging-gateway

Menormalisasi pesan dari semua channel (WhatsApp, Email, LinkedIn, Instagram, Telegram, Webchat)
menjadi satu skema `NormalizedMessage` dan mempublikasikannya ke event bus. Ini adalah komponen
inti mitigasi *upstream chaos* — lihat `docs/ARCHITECTURE.md` §4.1.

## Struktur

```
src/
  adapters/
    channel-adapter.interface.ts   kontrak yang wajib dipenuhi setiap adapter channel
    whatsapp.adapter.ts            stub — WhatsApp Business Cloud API (webhook)
    email.adapter.ts               stub — Microsoft Graph / Gmail API (IMAP IDLE fallback)
    linkedin.adapter.ts            stub — via partner terverifikasi (bukan scraping)
  events/
    kafka-topics.ts                nama topic, re-export dari @exportflow/shared-types
  thread-resolver.ts               mencocokkan ChannelIdentity -> Contact -> Thread
```

## Status

Belum ada implementasi jaringan nyata (belum terhubung ke API pihak ketiga). Fase 1 hanya
mendefinisikan kontrak interface supaya UI (`apps/web`) dan service lain bisa dikembangkan paralel
di atas skema yang sudah disepakati. Implementasi nyata adalah cakupan Fase 2 (lihat roadmap di
`docs/ARCHITECTURE.md` §10).
