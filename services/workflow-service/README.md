# workflow-service

Implementasi pola **document deadlock mitigation** dan **invoice-as-projection** dari
`docs/ARCHITECTURE.md` §7-8, di atas Temporal.io untuk durable execution (retry, timeout,
compensating action bawaan — penting karena satu siklus dokumen ekspor bisa berlangsung
berhari-hari dan melibatkan pihak yang responsnya tidak bisa dijamin tepat waktu).

## Isi

- `src/document-dag.ts` — definisi dependency graph antar jenis dokumen ekspor
  (Packing List, Invoice, B/L, COO) dan aturan draft-then-finalize yang memutus siklus
  tunggu-menunggu.
- `src/workflows/document-lifecycle.workflow.ts` — kerangka Temporal workflow untuk satu
  dokumen: draft → menunggu dependency final → finalize → amendment bila ada perubahan upstream.
- `src/workflows/invoice-projection.workflow.ts` — kerangka workflow yang meregenerasi invoice
  sebagai projection dari event shipment (bukan input manual), untuk transparansi line-item.

## Status

Fase 1: kontrak DAG dan struktur workflow didefinisikan agar tim bisa menyelaraskan model data
dokumen sejak awal. Eksekusi nyata di atas Temporal SDK adalah cakupan Fase 3 (lihat roadmap
`docs/ARCHITECTURE.md` §10) — menyusul setelah Omnichannel CRM (Fase 1-2) stabil.
