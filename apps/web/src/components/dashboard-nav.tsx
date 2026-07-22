"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/chatbot", label: "Chatbot", icon: Sparkles },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="flex shrink-0 flex-col justify-between border-r border-border bg-surface md:h-full md:w-56"
    >
      <div>
        <div className="flex h-14 items-center gap-2 border-b border-border px-4 md:h-16">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-ink text-[13px] font-semibold text-canvas"
            aria-hidden="true"
          >
            E
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            ExportFlow
          </span>
        </div>

        <ul className="flex gap-1 p-2 md:flex-col">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1 md:flex-none">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:justify-start",
                    active
                      ? "bg-ink text-canvas"
                      : "text-ink-muted hover:bg-surface-raised hover:text-ink"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden border-t border-border p-3 md:block">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs font-medium text-ink"
            aria-hidden="true"
          >
            TR
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">Trader</p>
            <p className="truncate text-xs text-ink-faint">ExportFlow Workspace</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
