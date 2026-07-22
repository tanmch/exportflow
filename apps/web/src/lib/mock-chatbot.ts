import type { ChatbotTurn } from "./types";
import { sampleProspects } from "./mock-data";

export const initialChatbotTurns: ChatbotTurn[] = [
  {
    id: "turn-1",
    role: "user",
    content: "Cari importir furniture rotan di Jerman yang aktif 6 bulan terakhir",
  },
  {
    id: "turn-2",
    role: "assistant",
    content:
      "Ditemukan 3 prospek yang cocok, diurutkan berdasarkan kecocokan komoditas dan aktivitas terbaru. Setiap hasil menyertakan sumber datanya agar bisa diverifikasi sebelum dihubungi.",
    prospects: sampleProspects,
  },
];

export const suggestedPrompts = [
  "Siapa ini? linkedin.com/in/contoh-buyer",
  "Ringkas percakapan dengan Marta Schulz minggu ini",
  "Cari buyer furniture outdoor di Amerika Utara",
  "Draft-kan balasan soal keterlambatan B/L",
];
