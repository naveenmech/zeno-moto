"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Bell, Menu } from "lucide-react";
import { NAV_ITEMS } from "./navItems";
import { useAppDispatch } from "@/store/hooks";
import { toggleMobileNav } from "@/store/uiSlice";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

let clockValue = Date.now();

function subscribeToClock(callback: () => void) {
  const id = setInterval(() => {
    clockValue = Date.now();
    callback();
  }, 1000);
  return () => clearInterval(id);
}

function useLiveClock() {
  const timestamp = useSyncExternalStore<number | null>(
    subscribeToClock,
    () => clockValue,
    () => null,
  );
  return timestamp ? new Date(timestamp) : null;
}

export function Topbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const now = useLiveClock();

  const active = NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-3.5 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleMobileNav())}
          className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-surface-muted md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold tracking-tight md:text-lg">
            {active?.label ?? "Overview"}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Nairobi HQ &middot;{" "}
            {now
              ? now.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })
              : "--"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-lg border border-border bg-surface-muted px-3 py-1.5 font-mono text-sm tabular-nums text-foreground sm:block">
          {now
            ? now.toLocaleTimeString(undefined, { hour12: false })
            : "--:--:--"}
        </div>
        <ThemeToggle />
        <button
          type="button"
          className="relative rounded-lg border border-border p-2 text-muted-foreground hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
