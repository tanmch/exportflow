import { ExternalLink, UserPlus } from "lucide-react";
import type { Prospect } from "@/lib/types";

const SOURCE_LABEL: Record<Prospect["source"], string> = {
  linkedin: "Sumber: LinkedIn",
  "email-signature": "Sumber: Signature email",
  "trade-directory": "Sumber: Direktori dagang",
  manual: "Sumber: Input manual",
};

export function ProspectCard({ prospect }: { prospect: Prospect }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{prospect.name}</p>
          <p className="text-xs text-ink-muted">
            {prospect.role} · {prospect.company}
          </p>
          <p className="text-xs text-ink-faint">{prospect.country}</p>
        </div>
        <span
          className="shrink-0 rounded-full border border-border-strong px-2 py-1 text-[11px] font-medium text-ink"
          aria-label={`Skor kecocokan ${prospect.matchScore} dari 100`}
        >
          {prospect.matchScore}% match
        </span>
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">{prospect.summary}</p>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-[11px] text-ink-faint">{SOURCE_LABEL[prospect.source]}</span>
        <div className="flex items-center gap-2">
          {prospect.sourceUrl && (
            <a
              href={`https://${prospect.sourceUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
            >
              <ExternalLink className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              Verifikasi
            </a>
          )}
          <button
            type="button"
            className="flex items-center gap-1 rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-canvas"
          >
            <UserPlus className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            Jadikan Contact
          </button>
        </div>
      </div>
    </div>
  );
}
