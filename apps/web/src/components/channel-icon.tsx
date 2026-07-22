import {
  Mail,
  Briefcase,
  MessageCircle,
  Camera,
  Send,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { ChannelType } from "@/lib/types";

const CHANNEL_META: Record<ChannelType, { label: string; icon: LucideIcon }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  email: { label: "Email", icon: Mail },
  linkedin: { label: "LinkedIn", icon: Briefcase },
  instagram: { label: "Instagram", icon: Camera },
  telegram: { label: "Telegram", icon: Send },
  webchat: { label: "Webchat", icon: Globe },
};

export function ChannelIcon({
  channel,
  className,
}: {
  channel: ChannelType;
  className?: string;
}) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  return (
    <span title={meta.label} aria-label={meta.label} className="inline-flex">
      <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

export function channelLabel(channel: ChannelType) {
  return CHANNEL_META[channel].label;
}
