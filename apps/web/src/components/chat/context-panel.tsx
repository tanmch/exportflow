import { ChannelIcon, channelLabel } from "@/components/channel-icon";
import type { Thread } from "@/lib/types";

export function ContextPanel({ thread }: { thread: Thread }) {
  return (
    <aside
      aria-label="Konteks kontak dan shipment"
      className="hidden h-full w-72 shrink-0 flex-col overflow-y-auto border-l border-border p-5 lg:flex"
    >
      <div className="flex flex-col items-center text-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border-strong text-base font-medium text-ink"
          aria-hidden="true"
        >
          {thread.contact.avatarInitials}
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">{thread.contact.name}</p>
        <p className="text-xs text-ink-muted">{thread.contact.role}</p>
        <p className="text-xs text-ink-faint">{thread.contact.company}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Identitas channel
        </h2>
        <ul className="mt-2 flex flex-col gap-2">
          {thread.contact.identities.map((identity) => (
            <li
              key={identity.channel}
              className="flex items-center gap-2.5 rounded-md border border-border px-2.5 py-2 text-xs text-ink-muted"
            >
              <ChannelIcon channel={identity.channel} className="h-4 w-4 shrink-0 text-ink-faint" />
              <span className="min-w-0 flex-1">
                <span className="block text-ink">{channelLabel(identity.channel)}</span>
                <span className="block truncate">{identity.handle}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {thread.shipmentRef && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Shipment terkait
          </h2>
          <div className="mt-2 rounded-md border border-border px-3 py-2.5">
            <p className="text-sm font-medium text-ink">{thread.shipmentRef}</p>
            <p className="mt-1 text-xs text-ink-muted">
              Dokumen &amp; invoice untuk shipment ini akan tampil di sini pada modul lanjutan.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
