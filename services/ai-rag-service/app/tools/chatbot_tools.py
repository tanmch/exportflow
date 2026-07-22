"""Definisi tool untuk orkestrasi chatbot lewat LLM tool-use (docs/ARCHITECTURE.md §4.2).

Setiap tool di sini adalah fungsi internal yang boleh dipanggil model saat menjawab
pertanyaan trader di halaman Chatbot. Skema mengikuti format tool Anthropic Messages API.
"""

CHATBOT_TOOLS = [
    {
        "name": "search_prospect",
        "description": (
            "Cari prospek/calon buyer atau supplier berdasarkan query bahasa natural "
            "(komoditas, negara, peran, rentang waktu aktivitas)."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "limit": {"type": "integer", "default": 10},
            },
            "required": ["query"],
        },
    },
    {
        "name": "enrich_by_linkedin_url",
        "description": "Ambil profil terstruktur dari URL LinkedIn (via partner API terverifikasi).",
        "input_schema": {
            "type": "object",
            "properties": {"url": {"type": "string"}},
            "required": ["url"],
        },
    },
    {
        "name": "enrich_by_email",
        "description": "Cari data profesional terkait dari alamat email (domain perusahaan, jabatan).",
        "input_schema": {
            "type": "object",
            "properties": {"email": {"type": "string"}},
            "required": ["email"],
        },
    },
    {
        "name": "create_contact",
        "description": "Simpan prospek sebagai Contact baru di CRM.",
        "input_schema": {
            "type": "object",
            "properties": {"prospect_id": {"type": "string"}},
            "required": ["prospect_id"],
        },
    },
    {
        "name": "summarize_thread",
        "description": "Ringkas histori percakapan Omnichannel untuk sebuah thread.",
        "input_schema": {
            "type": "object",
            "properties": {"thread_id": {"type": "string"}},
            "required": ["thread_id"],
        },
    },
]
