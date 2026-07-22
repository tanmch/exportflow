import { Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { ChannelIcon, channelLabel } from "@/components/channel-icon";
import type { Message } from "@/lib/types";

export function MessageBubble({ message }: { message: Message }) {
  const outbound = message.direction === "outbound";

  return (
    <div className={cn("flex flex-col gap-1", outbound ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
          outbound
            ? "bg-ink text-canvas"
            : "border border-border bg-surface text-ink"
        )}
      >
        {message.body}
      </div>
      <div
        className={cn(
          "flex items-center gap-1.5 px-1 text-[11px] text-ink-faint",
          outbound ? "flex-row-reverse" : "flex-row"
        )}
      >
        <ChannelIcon channel={message.channel} className="h-3 w-3" />
        <span>{channelLabel(message.channel)}</span>
        <span aria-hidden="true">·</span>
        <span>{message.timestamp}</span>
        {outbound && message.deliveryStatus && (
          <DeliveryStatusIcon status={message.deliveryStatus} />
        )}
      </div>
    </div>
  );
}

function DeliveryStatusIcon({ status }: { status: NonNullable<Message["deliveryStatus"]> }) {
  if (status === "sent") return <Clock className="h-3 w-3" aria-label="Terkirim" />;
  if (status === "delivered") return <Check className="h-3 w-3" aria-label="Diterima" />;
  if (status === "read") return <CheckCheck className="h-3 w-3" aria-label="Dibaca" />;
  return <span aria-label="Gagal terkirim" className="text-danger">!</span>;
}
