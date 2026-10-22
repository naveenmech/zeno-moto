"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const PROFILE = {
  name: "Naveenkumar A",
  role: "Operations Admin",
  email: "vas.naveenkumar99@gmail.com",
  whatsapp: "+91 9842850819",
};

const WHATSAPP_LINK = `https://wa.me/${PROFILE.whatsapp.replace(/[^0-9]/g, "")}`;

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-soft text-xs font-semibold text-electric"
        title={PROFILE.name}
        aria-haspopup="true"
        aria-expanded={open}
      >
        NV
      </button>

      <div
        className={cn(
          "absolute right-0 top-full z-30 mt-2 w-72 origin-top-right rounded-xl border border-border bg-surface shadow-xl transition duration-150 ease-out",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric-soft text-sm font-semibold text-electric">
            NV
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
              <Briefcase size={13} className="shrink-0 text-muted-foreground" />
              {PROFILE.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{PROFILE.role}</p>
          </div>
        </div>

        <div className="p-1.5">
          <a
            href={`mailto:${PROFILE.email}`}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-surface-muted"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric-soft text-electric">
              <Mail size={15} />
            </span>
            <span className="min-w-0 truncate text-foreground">{PROFILE.email}</span>
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-surface-muted"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
              <MessageCircle size={15} />
            </span>
            <span className="min-w-0 truncate text-foreground">{PROFILE.whatsapp}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
