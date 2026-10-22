"use client";

import { Briefcase, Mail, MessageCircle } from "lucide-react";

const PROFILE = {
  name: "Naveenkumar A",
  role: "Operations Admin",
  email: "vas.naveenkumar99@gmail.com",
  whatsapp: "+91 9842850819",
};

const WHATSAPP_LINK = `https://wa.me/${PROFILE.whatsapp.replace(/[^0-9]/g, "")}`;

export function ProfileMenu() {
  return (
    <div className="group relative">
      <div
        className="flex h-8 w-8 cursor-default items-center justify-center rounded-full bg-electric-soft text-xs font-semibold text-electric"
        title={PROFILE.name}
      >
        NV
      </div>

      <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 w-72 origin-top-right scale-95 rounded-xl border border-border bg-surface opacity-0 shadow-xl transition duration-150 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
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
