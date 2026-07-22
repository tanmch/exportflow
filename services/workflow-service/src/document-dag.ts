export type DocumentType = "packing_list" | "booking_confirmation" | "invoice" | "bill_of_lading" | "certificate_of_origin";

export type DocumentStage = "draft" | "final" | "amended";

interface DocumentDependency {
  document: DocumentType;
  /** Dokumen ini boleh berstatus draft hanya jika seluruh dependency berikut sudah draft. */
  requiresDraftOf: DocumentType[];
  /** Dokumen ini boleh finalize hanya jika seluruh dependency berikut sudah final. */
  requiresFinalOf: DocumentType[];
  /** SLA sebelum workflow mengeskalasi ke thread Omnichannel terkait. */
  escalationSlaHours: number;
}

/**
 * Graph dependency dokumen ekspor (docs/ARCHITECTURE.md §7). Pola draft-then-finalize
 * memutus deadlock klasik "A tidak bisa mulai sebelum B selesai 100%": setiap dokumen boleh
 * dikerjakan paralel dalam bentuk draft begitu dependency-nya berstatus draft, dan baru
 * menunggu versi final saat akan difinalisasi.
 */
export const DOCUMENT_DAG: Record<DocumentType, DocumentDependency> = {
  packing_list: {
    document: "packing_list",
    requiresDraftOf: [],
    requiresFinalOf: [],
    escalationSlaHours: 24,
  },
  booking_confirmation: {
    document: "booking_confirmation",
    requiresDraftOf: [],
    requiresFinalOf: [],
    escalationSlaHours: 24,
  },
  invoice: {
    document: "invoice",
    requiresDraftOf: ["packing_list", "booking_confirmation"],
    requiresFinalOf: ["packing_list"],
    escalationSlaHours: 48,
  },
  bill_of_lading: {
    document: "bill_of_lading",
    requiresDraftOf: ["invoice"],
    requiresFinalOf: ["invoice"],
    escalationSlaHours: 48,
  },
  certificate_of_origin: {
    document: "certificate_of_origin",
    requiresDraftOf: ["bill_of_lading"],
    requiresFinalOf: ["bill_of_lading"],
    escalationSlaHours: 72,
  },
};

export function canEnterStage(
  document: DocumentType,
  targetStage: Exclude<DocumentStage, "amended">,
  dependencyStages: Partial<Record<DocumentType, DocumentStage>>
): boolean {
  const rule = DOCUMENT_DAG[document];
  const required = targetStage === "draft" ? rule.requiresDraftOf : rule.requiresFinalOf;
  const minStage: DocumentStage = targetStage === "draft" ? "draft" : "final";

  return required.every((dep) => {
    const stage = dependencyStages[dep];
    if (!stage) return false;
    if (minStage === "draft") return stage === "draft" || stage === "final" || stage === "amended";
    return stage === "final" || stage === "amended";
  });
}
