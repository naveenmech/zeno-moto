"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BatteryCharging } from "lucide-react";
import { NAV_ITEMS } from "./navItems";
import { cn } from "@/lib/cn";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-electric text-background shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--accent)_70%,transparent)]">
          <BatteryCharging size={20} strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight">Zeno Moto</p>
          <p className="text-xs text-muted-foreground">Swap Network Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl py-2.5 pl-3.5 pr-3 text-sm font-semibold transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-accent" />
              )}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-accent-soft text-accent-strong" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon size={16} strokeWidth={2.25} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative mx-3 mb-4 overflow-hidden rounded-2xl border border-border bg-surface-muted p-3.5">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/15 blur-xl" />
        <p className="text-xs font-semibold text-muted-foreground">Network region</p>
        <p className="mt-1 text-sm font-bold">Kenya &middot; 150 stations live</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent-strong">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          All systems operational
        </div>
      </div>
    </div>
  );
}
