export interface ShipmentLineItemEvent {
  eventId: string;
  shipmentId: string;
  kind: "freight" | "handling" | "customs" | "insurance" | "other";
  amount: number;
  currency: string;
  sourceEventId: string;
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
  currency: string;
  /** Ditelusuri balik ke event shipment sumber — audit trail per baris (docs/ARCHITECTURE.md §8). */
  sourceEventId: string;
}

/**
 * Invoice sebagai projection dari event shipment, bukan entri manual. Setiap kali event
 * shipment baru masuk (biaya freight/handling/customs berubah), workflow ini meregenerasi
 * baris invoice terkait sehingga rincian selalu bisa ditelusuri ke sumbernya.
 * TODO Fase 3: konsumsi stream event shipment via Temporal signal, tulis hasil ke ledger
 * Postgres dengan versi ter-audit (bukan overwrite).
 */
export function projectInvoiceLineItems(events: ShipmentLineItemEvent[]): InvoiceLineItem[] {
  return events.map((event) => ({
    description: `${event.kind} — ${event.shipmentId}`,
    amount: event.amount,
    currency: event.currency,
    sourceEventId: event.sourceEventId,
  }));
}
