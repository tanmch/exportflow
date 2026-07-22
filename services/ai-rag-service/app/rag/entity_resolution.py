"""Pencocokan entitas: prospek/kontak baru vs Contact yang sudah ada.

TODO Fase 2: fuzzy match nama + domain email + nama perusahaan (mis. via
rapidfuzz), dengan threshold conservative untuk hindari merge keliru
(lebih baik trader mengonfirmasi manual daripada Contact tergabung salah).
"""

from __future__ import annotations


async def find_matching_contact(name: str, company: str, email_domain: str | None) -> str | None:
    raise NotImplementedError("Entity resolution belum diimplementasikan — lihat TODO Fase 2.")
