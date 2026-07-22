# ExportFlow

Platform omnichannel CRM untuk bisnis ekspor — menghubungkan trader, forwarder, dan klien
dalam satu alur kerja, dengan mitigasi terhadap upstream chaos, downstream invoice friction,
dan document deadlock.

Kerangka arsitektur lengkap: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Status

Fase 1 — Omnichannel CRM: dashboard **Chatbot** (RAG prospecting) dan **Chat** (unified inbox)
sudah bisa dijalankan dengan data mock. Service backend (`services/*`) berisi kontrak
interface/skema yang jadi fondasi Fase 2-4.

## Struktur

```
apps/
  web/                  Next.js — dashboard Chatbot + Chat (jalankan ini untuk demo UI)
services/
  api-gateway/          BFF: auth, WebSocket, proxy ke service lain (kontrak modul)
  messaging-gateway/     Adapter omnichannel: WhatsApp, Email, LinkedIn, dst.
  ai-rag-service/        RAG prospecting + chatbot orchestration (FastAPI, jalan dengan mock data)
  workflow-service/      Document deadlock mitigation + invoice projection (kontrak Temporal)
packages/
  shared-types/          Skema data kanonis lintas service
docs/
  ARCHITECTURE.md        Kerangka sistem lengkap
```

## Menjalankan frontend (demo UI)

```bash
cd apps/web
npm install
npm run dev
```

Buka `http://localhost:3000` → otomatis diarahkan ke `/chat`. Menu `Chatbot` ada di sidebar.

## Menjalankan ai-rag-service (mock)

```bash
cd services/ai-rag-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8100
```
