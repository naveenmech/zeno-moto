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
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
          <BatteryCharging size={20} strokeWidth={2.25} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight">Zeno Moto</p>
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-accent-strong"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              )}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-border bg-surface-muted p-3.5">
        <p className="text-xs font-medium text-muted-foreground">Network region</p>
        <p className="mt-1 text-sm font-semibold">Kenya &middot; 150 stations live</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-accent-strong">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          All systems operational
        </div>
      </div>
    </div>
  );
}
