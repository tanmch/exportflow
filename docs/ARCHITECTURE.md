# ExportFlow — Arsitektur Platform Omnichannel CRM untuk Bisnis Ekspor

Status: Draft v1 (kerangka awal)
Cakupan dokumen ini: fondasi platform + detail modul Omnichannel CRM (chat unifikasi + RAG prospecting).
Modul invoicing detail & document workflow dijelaskan di level kontrak/interface agar modul CRM bisa dibangun kompatibel sejak awal.

---

## 1. Konteks Bisnis

ExportFlow menghubungkan tiga peran dalam rantai ekspor:

- **Trader/Eksportir** — pemilik relasi, butuh visibilitas penuh atas semua percakapan & dokumen.
- **Forwarder** — eksekutor logistik (booking, B/L, custom clearance), sumber utama *upstream chaos* karena update status datang lewat WA/email/telepon secara tidak terstruktur.
- **Klien/Buyer** — penerima invoice & dokumen, sumber *downstream friction* saat invoice tidak transparan atau dokumen saling tunggu (deadlock).

Tiga masalah inti yang arsitektur ini harus mitigasi:

| Masalah | Akar penyebab | Strategi mitigasi arsitektural |
|---|---|---|
| **Upstream chaos** | Update dari forwarder tersebar di banyak channel (WA, email, LinkedIn, telepon), tidak ada single source of truth | Event-driven backbone + Unified Inbox omnichannel; setiap pesan dinormalisasi jadi event `message.received` dengan `thread_id` yang terikat ke `shipment_id` |
| **Downstream invoice friction** | Klien tidak melihat rincian biaya real-time, dispute lambat direspon | Invoice sebagai *materialized view* dari event shipment (bukan input manual) + audit trail line-item + portal transparansi klien |
| **Document deadlock** | Dokumen ekspor saling bergantung sirkular (Invoice butuh Packing List final, B/L butuh Invoice, COO butuh B/L draft, dst) sehingga semua pihak saling menunggu | Document Dependency DAG + pola **draft-then-finalize** (dua fase) dijalankan via durable workflow engine, bukan status field manual |

---

## 2. Prinsip Arsitektur

1. **Event-sourced backbone** — semua perubahan state (pesan masuk, status booking, dokumen di-upload, invoice diterbitkan) adalah event immutable di message bus. Read model (UI, laporan) adalah proyeksi dari event ini → mudah audit, replay, dan reconcile saat data dari forwarder simpang siur.
2. **Single-thread-per-context** — satu percakapan Omnichannel = satu `thread`, terikat opsional ke satu `deal`/`shipment`. Tidak ada percakapan yang "hilang" karena pindah channel.
3. **Compliance by default** — setiap entity punya audit log (who/when/what), data personal (email, nomor WA, profil LinkedIn) diberi label sensitivitas untuk kebutuhan GDPR/UU PDP.
4. **API-first & plugin-first** — semua modul internal juga dipakai lewat API publik terdokumentasi (OpenAPI) supaya plugin resmi (WhatsApp, custom ERP klien, dsb.) punya akses setara dengan UI internal.
5. **Boring technology di jalur kritikal** — Postgres, Kafka, Kubernetes: matang, teruji, punya cerita compliance (SOC2 report tersedia dari vendor terkelola). Inovasi (RAG, LLM orchestration) diisolasi di service Python yang bisa diganti tanpa mengganggu jalur transaksi inti.

---

## 3. Arsitektur Sistem — Container View

```
                                   ┌─────────────────────────────┐
                                   │        apps/web (Next.js)   │
                                   │  Dashboard: Chatbot | Chat   │
                                   └───────────────┬──────────────┘
                                                    │ REST/GraphQL + WebSocket
                                   ┌───────────────▼──────────────┐
                                   │      API Gateway (NestJS)     │
                                   │  AuthN/Z, rate limit, BFF     │
                                   └───┬───────┬───────┬──────────┘
                    ┌──────────────────┘       │       └───────────────────┐
                    │                           │                          │
        ┌───────────▼───────────┐   ┌──────────▼──────────┐   ┌───────────▼────────────┐
        │  Messaging Gateway     │   │  AI / RAG Service     │   │  Document & Invoice     │
        │  (Node/Go)             │   │  (Python FastAPI)     │   │  Workflow (NestJS +     │
        │  Adapter per channel:  │   │  - Prospect search    │   │  Temporal.io)           │
        │  WA Business, Email,   │   │  - Chatbot orchestr.  │   │  - Doc dependency DAG   │
        │  LinkedIn(*), IG/FB,   │   │  - Embedding pipeline │   │  - Invoice ledger       │
        │  Telegram, Webchat     │   │  - Entity enrichment  │   │                         │
        └───────────┬────────────┘   └──────────┬────────────┘   └───────────┬────────────┘
                    │                            │                            │
                    └────────────► Kafka / Redpanda (event backbone) ◄────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    │                                │                                │
          ┌─────────▼─────────┐           ┌──────────▼─────────┐           ┌─────────▼─────────┐
          │ PostgreSQL 16      │           │ pgvector / Qdrant   │           │ S3-compatible       │
          │ (OLTP, ledger,     │           │ (vector index untuk │           │ object storage       │
          │ audit log)         │           │ RAG prospecting)    │           │ (dokumen, lampiran)  │
          └────────────────────┘           └──────────────────────┘         └──────────────────────┘
```
(*) LinkedIn tidak menyediakan public messaging API resmi → diakses via **partner terverifikasi** (mis. Unipile) yang legal untuk automasi terbatas; jangan scraping langsung.

---

## 4. Modul Omnichannel CRM (fokus implementasi tahap ini)

### 4.1 Unified Inbox — "chat tanpa pindah aplikasi"

**Model data inti:**

```
Contact 1───* ChannelIdentity   (nomor WA, email, linkedin_urn, ig_handle...)
Contact 1───* Thread
Thread   1───* Message
Message  *───1 ChannelIdentity  (channel asal pesan tsb)
Thread   *───0..1 Deal / Shipment
```

Kuncinya: **Contact** adalah entitas orang/organisasi tunggal; **ChannelIdentity** adalah alias channel yang di-*link* ke Contact (manual atau otomatis via entity resolution di RAG service). Trader membalas dari satu `Thread`, sistem yang menentukan lewat channel mana balasan dikirim keluar (channel terakhir dipakai kontak, atau channel prioritas yang dikonfigurasi).

**Alur pesan masuk:**
1. Adapter channel (webhook WA Business Cloud API / Meta Graph API / Microsoft Graph atau IMAP IDLE untuk email / Unipile untuk LinkedIn) menerima payload mentah.
2. Adapter menormalisasi ke skema `NormalizedMessage` dan publish event `message.received` ke Kafka.
3. Consumer "Thread Resolver" mencari `ChannelIdentity` yang cocok → jika belum ada Contact, buat *shadow contact* lalu trigger RAG enrichment (§4.2) secara async.
4. Message disimpan, WebSocket push ke `apps/web` yang sedang membuka thread terkait (real-time, latensi target < 500ms).

**Alur pesan keluar:** UI kirim ke API Gateway → gateway publish `message.send_requested` → adapter channel terkait yang mengeksekusi (idempotent, retry dengan backoff, status delivery dikembalikan sebagai event `message.delivery_status`).

Ini langsung memitigasi **upstream chaos**: forwarder bisa tetap pakai WA/email kesukaannya, tapi trader melihat semuanya sebagai satu thread per shipment.

### 4.2 RAG Prospecting — "cari & datakan siapa saja dari chatbot"

Tujuan: dari chatbot, trader bisa bilang *"cari importir furniture rotan di Jerman yang aktif 6 bulan terakhir"* atau *"siapa ini, [tempel link LinkedIn/email]?"* dan sistem mengembalikan profil terstruktur + siap jadi Contact.

**Pipeline:**

```
Sumber data (opt-in & compliant):
 - LinkedIn (via partner API terverifikasi, bukan scraping)
 - Email signature parsing dari thread yang sudah ada
 - Company registries / trade directories publik
 - Data yang trader upload manual (CSV, business card scan)
        │
        ▼
Ingestion & Normalization Worker (Python)
        │  → ekstrak entity: nama, jabatan, perusahaan, negara, komoditas
        ▼
Embedding Pipeline (model embedding teks) ──► pgvector / Qdrant (index prospek)
        │
        ▼
Entity Resolution: cocokkan dengan Contact existing (fuzzy match nama+perusahaan+domain email)
        │
        ▼
Chatbot Orchestration Layer (LLM + tool-use, mis. Claude):
   tools tersedia: search_prospect(query), enrich_by_linkedin_url(url),
                    enrich_by_email(email), create_contact(payload),
                    summarize_thread(thread_id), search_internal_knowledge(query)
```

**Kenapa RAG (bukan sekadar keyword search)**: query trader berbentuk natural language & samar ("importir yang pernah komplain soal lead time"), butuh retrieval semantik atas gabungan data terstruktur (company registry) + tidak terstruktur (histori chat, catatan trader). Retrieval hasil di-*ground*-kan ke sumber asli (link LinkedIn/email/thread) supaya jawaban chatbot bisa diverifikasi — hindari halusinasi.

**Guardrail compliance**: setiap prospek yang di-enrich otomatis mencatat *provenance* (dari sumber mana, kapan, dengan consent basis apa) — wajib untuk audit GDPR/UU PDP karena data personal (nama, email, jabatan) dikumpulkan dari pihak ketiga.

### 4.3 Chatbot sebagai satu-satunya "asisten", Chat sebagai satu-satunya "inbox"

Sesuai requirement produk: dashboard **hanya** punya 2 menu top-level:
- **Chatbot** — asisten AI (RAG prospecting, ringkasan thread, draft balasan, insight shipment).
- **Chat** — unified inbox omnichannel.

Semua fungsi lain (lihat detail shipment, invoice, dokumen) diakses **kontekstual dari dalam thread/chatbot** (side panel), bukan menu terpisah — ini yang membuat UI tetap sederhana tapi tetap powerful (progressive disclosure, lihat §5).

---

## 5. Prinsip UI/UX

- **Palet monokrom** (`#0A0A0A` di atas `#FFFFFF`, satu warna aksen abu netral untuk state, tanpa warna brand mencolok) → fokus ke konten, terasa "profesional/dokumen" cocok nuansa trading-ekspor, bukan generik SaaS berwarna cerah.
- **Tipografi**: satu typeface sans-serif netral dengan hinting bagus di layar kecil (Inter / Geist / IBM Plex Sans — grotesk, x-height tinggi, angka tabular untuk data invoice/nomor kontainer). Skala terbatas (4–5 ukuran) supaya konsisten.
- **Kontras & aksesibilitas**: target WCAG 2.1 AA minimum (rasio kontras teks ≥4.5:1), semua interaksi bisa lewat keyboard, focus ring terlihat jelas (karena palet monokrom rawan focus state hilang), target tap ≥44px, `prefers-reduced-motion` dihormati.
- **Progressive disclosure**: 2 menu utama + panel kontekstual, bukan sidebar penuh menu seperti CRM generik (HubSpot/Salesforce-style) — ini yang dimaksud "tidak pasaran".
- **Layout**: 3 kolom saat desktop (daftar thread → percakapan → panel konteks/AI), collapse jadi 1 kolom + navigasi bertumpuk saat mobile.

---

## 6. Tech Stack & Rationale

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui (di-restyle monokrom) | SSR/streaming untuk performa, ekosistem matang, mudah cari talent |
| Realtime | WebSocket (native `ws` di belakang API Gateway) + Redis pub/sub | Latensi rendah untuk chat, horizontal scalable lewat Redis adapter |
| API Gateway/BFF | NestJS (TypeScript) | DI & modularitas kuat untuk compliance (guard, interceptor audit log bawaan), OpenAPI auto-gen untuk plugin ekosistem |
| Messaging Gateway | Node.js (adapter per channel) | Library resmi channel (WA Cloud API, Graph API) mayoritas JS/HTTP-first |
| AI/RAG Service | Python FastAPI + LangChain/LlamaIndex (orkestrasi) + Claude API (reasoning/tool-use) | Ekosistem ML/NLP terlengkap ada di Python; dipisah sebagai service agar model/vendor LLM bisa diganti tanpa sentuh core |
| Event backbone | Apache Kafka (atau Redpanda jika mau ops lebih ringan) | Decouple upstream chaos, replay-able, mendukung banyak consumer (invoice projector, RAG indexer, notifikasi) tanpa saling blocking |
| Document/Invoice Workflow | Temporal.io di atas NestJS | Durable execution untuk saga multi-hari (dokumen ekspor bisa perlu berhari-hari), built-in retry/timeout/compensation → alat utama mitigasi document deadlock |
| Database utama | PostgreSQL 16 | ACID untuk ledger invoice & audit, ekstensi pgvector menyatukan OLTP+vector tanpa infra tambahan di tahap awal |
| Vector store | pgvector (awal) → Qdrant (saat skala prospek besar) | Mulai sederhana, upgrade path jelas saat volume RAG tumbuh |
| Cache/session/pubsub | Redis | Matang, dipakai juga untuk rate limiting & WebSocket fan-out |
| Object storage | S3-compatible (MinIO on-prem / cloud S3) | Versioning + retention policy untuk dokumen legal ekspor |
| Auth/Identity | Keycloak (self-host) atau WorkOS (managed) | RBAC + SSO + audit log siap pakai, jalur cepat ke SOC2/ISO27001 |
| Infra | Docker + Kubernetes + Terraform | Scalable, matang, dukungan compliance vendor (EKS/GKE punya sertifikasi bawaan) |
| Observability | OpenTelemetry + Grafana/Loki/Tempo | Wajib untuk sistem time-sensitive (deteksi latency chat/webhook naik) |
| Plugin platform | Webhook + signed manifest + versioned TS SDK (pola ala Slack/Shopify Apps) | Official plugin ecosystem: OAuth scoped, sandbox, marketplace listing |

---

## 7. Document Deadlock Mitigation (kontrak untuk modul lanjutan)

Model dependency sebagai DAG eksplisit, bukan checklist implisit:

```
PackingList(draft) ─┐
                     ├─► Invoice(draft) ─► B/L(draft) ─► COO(draft) ─► Invoice(final) ─► B/L(final)
BookingConfirmed ────┘
```

Aturan yang memutus siklus tunggu-menunggu:
1. **Draft-then-finalize**: setiap dokumen boleh dibuat versi *draft* hanya berdasarkan dependency versi *draft* lain (paralel), finalisasi baru menunggu dependency final — memutus deadlock "A tidak bisa mulai sebelum B selesai 100%".
2. **Timeout & eskalasi otomatis** dikelola Temporal: jika satu pihak tidak merespon dalam SLA, workflow trigger notifikasi ke thread Omnichannel terkait (bukan menunggu pasif).
3. **Compensating action**: jika dokumen upstream berubah setelah dokumen downstream final (mis. jumlah kontainer berubah setelah invoice terbit), workflow generate *amendment* terlacak, bukan overwrite diam-diam.

## 8. Downstream Invoice Friction (kontrak untuk modul lanjutan)

- Invoice adalah **projection**, bukan entri manual: line item ditarik dari event shipment (biaya freight, handling, custom) sehingga rincian selalu bisa ditelusuri balik ke event sumber (audit trail per baris).
- Klien punya portal read-only yang menunjukkan status real-time + kanal dispute langsung terhubung ke `Thread` Omnichannel yang sama (dispute invoice = pesan baru di thread yang sudah ada konteksnya, bukan tiket terpisah).

---

## 9. Struktur Repository

```
exportflow/
├── docs/
│   └── ARCHITECTURE.md          (dokumen ini)
├── apps/
│   └── web/                     (Next.js — dashboard Chatbot + Chat)
├── services/
│   ├── api-gateway/             (NestJS — BFF, auth, WebSocket)
│   ├── messaging-gateway/       (Node — adapter WA/email/LinkedIn/dst)
│   ├── ai-rag-service/          (Python FastAPI — RAG prospecting + chatbot orchestration)
│   └── workflow-service/        (NestJS + Temporal — dokumen & invoice, tahap lanjutan)
└── packages/
    └── shared-types/            (tipe TypeScript bersama: Message, Contact, Thread, dsb.)
```

## 10. Roadmap Fase

| Fase | Cakupan |
|---|---|
| **Fase 1 (dokumen ini)** | Dashboard Chatbot+Chat (UI), skema data Contact/Thread/Message, scaffold Messaging Gateway (mock adapter), scaffold AI/RAG service (interface + mock retrieval) |
| Fase 2 | Integrasi channel nyata (WA Business Cloud API, email via Microsoft Graph/Gmail API), embedding pipeline produksi, entity resolution otomatis |
| Fase 3 | Workflow-service (Temporal) untuk dokumen & invoice, portal klien |
| Fase 4 | Plugin platform publik + marketplace, multi-tenant hardening, sertifikasi compliance (SOC2 Type II) |

---

*Dokumen ini adalah kerangka hidup — akan diperbarui seiring modul invoicing & document workflow diimplementasikan secara detail.*
