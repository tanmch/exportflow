import { canEnterStage, DOCUMENT_DAG, type DocumentStage, type DocumentType } from "../document-dag";

export interface DocumentLifecycleInput {
  document: DocumentType;
  dependencyStages: Partial<Record<DocumentType, DocumentStage>>;
}

export interface DocumentLifecycleActivities {
  notifyThreadForEscalation(document: DocumentType, threadId: string): Promise<void>;
  persistStageChange(document: DocumentType, stage: DocumentStage): Promise<void>;
  generateAmendment(document: DocumentType, reason: string): Promise<void>;
}

/**
 * Kerangka Temporal workflow untuk siklus hidup satu dokumen ekspor.
 * TODO Fase 3: implementasi nyata di atas @temporalio/workflow — signal untuk
 * "dependency berubah status", timer SLA per DOCUMENT_DAG[document].escalationSlaHours,
 * dan compensating action (generateAmendment) saat dependency upstream berubah
 * setelah dokumen ini sudah final (docs/ARCHITECTURE.md §7 aturan 3).
 */
export async function documentLifecycleWorkflow(
  input: DocumentLifecycleInput,
  activities: DocumentLifecycleActivities,
  threadId: string
): Promise<void> {
  const rule = DOCUMENT_DAG[input.document];

  if (canEnterStage(input.document, "draft", input.dependencyStages)) {
    await activities.persistStageChange(input.document, "draft");
  } else {
    await activities.notifyThreadForEscalation(input.document, threadId);
    return;
  }

  if (!canEnterStage(input.document, "final", input.dependencyStages)) {
    // TODO Fase 3: tunggu signal dependency final dengan timeout rule.escalationSlaHours,
    // lalu escalate otomatis bila SLA terlampaui — bukan menunggu pasif.
    void rule.escalationSlaHours;
    return;
  }

  await activities.persistStageChange(input.document, "final");
}
