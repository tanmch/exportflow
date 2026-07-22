"""Entrypoint FastAPI untuk ai-rag-service.

Endpoint saat ini mengembalikan data mock (sinkron dengan apps/web/src/lib/mock-data.ts)
agar kontrak API bisa diintegrasikan lebih awal. Pipeline RAG produksi (app/rag/*) adalah
cakupan Fase 2 — lihat README.md.
"""

from fastapi import FastAPI

from app.models import (
    ChatbotMessageRequest,
    ChatbotMessageResponse,
    ProspectSearchRequest,
    ProspectSearchResponse,
)

app = FastAPI(title="ExportFlow AI/RAG Service", version="0.1.0")

_MOCK_PROSPECTS = [
    {
        "id": "p1",
        "name": "Lukas Berger",
        "company": "Berger Wohnkultur GmbH",
        "role": "Head of Sourcing",
        "country": "Jerman",
        "commodity": "Furnitur rotan & anyaman",
        "match_score": 92,
        "source": "linkedin",
        "source_url": "linkedin.com/in/lukasberger",
        "summary": "Aktif posting soal sourcing furnitur outdoor Asia Tenggara 6 minggu terakhir.",
        "provenance": {
            "collected_at": "2026-06-01T00:00:00Z",
            "consent_basis": "public-professional-profile",
        },
    }
]


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/prospects/search", response_model=ProspectSearchResponse)
async def search_prospects(payload: ProspectSearchRequest) -> ProspectSearchResponse:
    return ProspectSearchResponse(prospects=_MOCK_PROSPECTS[: payload.limit])


@app.post("/chatbot/message", response_model=ChatbotMessageResponse)
async def chatbot_message(payload: ChatbotMessageRequest) -> ChatbotMessageResponse:
    return ChatbotMessageResponse(
        reply=(
            "Ini respons mock dari ai-rag-service. Di produksi, jawaban dihasilkan lewat "
            "orkestrasi tool-use (lihat app/tools/chatbot_tools.py) di atas hasil retrieval RAG."
        ),
        prospects=_MOCK_PROSPECTS,
    )
