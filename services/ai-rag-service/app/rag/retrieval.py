"""Hybrid retrieval (semantic + keyword) atas indeks prospek di pgvector/Qdrant.

TODO Fase 2: query pgvector dengan cosine similarity + filter terstruktur
(negara, komoditas, rentang waktu aktivitas), gabungkan dengan full-text search
Postgres untuk query yang mengandung istilah spesifik (nama perusahaan, jabatan).
"""

from __future__ import annotations

from app.models import Prospect


async def search_prospects(query: str, limit: int = 10) -> list[Prospect]:
    raise NotImplementedError("Retrieval belum terhubung ke vector store — lihat TODO Fase 2.")
