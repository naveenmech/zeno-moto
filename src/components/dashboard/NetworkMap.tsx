"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { StationSummary } from "@/types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const DOT_COLOR: Record<StationSummary["status"], string> = {
  online: "bg-accent",
  degraded: "bg-warning",
  offline: "bg-danger",
};

export function NetworkMap({ stations }: { stations: StationSummary[] }) {
  const [hovered, setHovered] = useState<StationSummary | null>(null);

  const counts = stations.reduce(
    (acc, s) => {
      acc[s.status] += 1;
      return acc;
    },
    { online: 0, degraded: 0, offline: 0 } as Record<StationSummary["status"], number>
  );

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Live network map — Kenya</p>
          <p className="text-xs text-muted-foreground">{stations.length} swap stations across 6 regions</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Legend color="bg-accent" label={`${counts.online} online`} />
          <Legend color="bg-warning" label={`${counts.degraded} degraded`} />
          <Legend color="bg-danger" label={`${counts.offline} offline`} />
        </div>
      </div>

      <div
        className="relative h-72 w-full overflow-hidden rounded-xl border border-border md:h-80"
        style={{
          backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundColor: "var(--color-surface-muted)",
        }}
      >
        {stations.map((s) => (
          <Link
            key={s.id}
            href={`/stations/${s.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered((h) => (h?.id === s.id ? null : h))}
          >
            <motion.span
              whileHover={{ scale: 1.6 }}
              className={cn(
                "block h-2 w-2 rounded-full ring-2 ring-surface",
                DOT_COLOR[s.status],
                s.status === "online" && "animate-pulse-ring"
              )}
            />
          </Link>
        ))}

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 w-44 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg"
            style={{ left: `${hovered.x}%`, top: `${hovered.y}%` }}
          >
            <p className="font-semibold">{hovered.name}</p>
            <p className="text-muted-foreground">{hovered.region}</p>
            <p className="mt-1 flex items-center justify-between">
              <span className="capitalize text-muted-foreground">{hovered.status}</span>
              <span className="font-mono tabular-nums">{hovered.swapsToday} swaps</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {label}
    </span>
  );
}
