# ai-rag-service

Service Python (FastAPI) untuk dua fungsi inti Omnichannel CRM (lihat `docs/ARCHITECTURE.md` §4.2):

1. **RAG Prospecting** — pencarian semantik atas data prospek (LinkedIn, signature email,
   direktori dagang) dengan hasil yang selalu bisa ditelusuri ke sumber aslinya.
2. **Chatbot Orchestration** — lapisan tool-use (LLM, mis. Claude) yang memanggil fungsi
   internal (`search_prospect`, `enrich_by_linkedin_url`, `summarize_thread`, dst).

## Struktur

```
app/
  main.py                     entrypoint FastAPI, endpoint /prospects/search, /chatbot/message
  models.py                   skema Pydantic (mirror @exportflow/shared-types)
  rag/
    embedding.py              stub pipeline embedding teks -> vector
    retrieval.py              stub hybrid search (pgvector) + ranking
    entity_resolution.py      stub fuzzy match nama+perusahaan+domain email -> Contact
  tools/
    chatbot_tools.py          definisi tool untuk LLM tool-use orchestration
requirements.txt
```

## Status

Endpoint mengembalikan data yang belum terhubung ke vector store nyata — ini adalah kontrak
API awal agar `apps/web` dan `services/api-gateway` bisa diintegrasikan sejak Fase 1, sebelum
pipeline RAG produksi (embedding, indexing, entity resolution) dibangun di Fase 2.

## Menjalankan (setelah dependency terisi)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8100
```
