from typing import Literal, Optional

from pydantic import BaseModel


class ProspectProvenance(BaseModel):
    collected_at: str
    consent_basis: Literal[
        "public-professional-profile", "manual-upload", "existing-thread"
    ]


class Prospect(BaseModel):
    id: str
    name: str
    company: str
    role: str
    country: str
    commodity: str
    match_score: int
    source: Literal["linkedin", "email-signature", "trade-directory", "manual"]
    source_url: Optional[str] = None
    summary: str
    provenance: ProspectProvenance


class ProspectSearchRequest(BaseModel):
    query: str
    limit: int = 10


class ProspectSearchResponse(BaseModel):
    prospects: list[Prospect]


class ChatbotMessageRequest(BaseModel):
    thread_id: Optional[str] = None
    message: str


class ChatbotMessageResponse(BaseModel):
    reply: str
    prospects: list[Prospect] = []
