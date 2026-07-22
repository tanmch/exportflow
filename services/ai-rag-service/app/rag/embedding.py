"""Pipeline embedding teks -> vector untuk indeks prospek (docs/ARCHITECTURE.md §4.2).

TODO Fase 2: pilih model embedding (mis. Voyage AI voyage-3 atau BGE lokal),
batching, dan penulisan ke kolom pgvector.
"""

from __future__ import annotations


async def embed_text(text: str) -> list[float]:
    raise NotImplementedError("Pipeline embedding belum diimplementasikan — lihat TODO Fase 2.")


async def embed_batch(texts: list[str]) -> list[list[float]]:
    raise NotImplementedError("Pipeline embedding belum diimplementasikan — lihat TODO Fase 2.")
