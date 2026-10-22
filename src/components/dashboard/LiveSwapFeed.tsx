"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { SwapTransaction } from "@/types";
import { Card } from "@/components/ui/Card";

function timeAgo(iso: string) {
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export function LiveSwapFeed({ swaps, maxHeight }: { swaps: SwapTransaction[]; maxHeight?: number }) {
  return (
    <Card
      className="flex flex-col overflow-hidden p-4 md:p-5"
      style={maxHeight ? { height: maxHeight } : undefined}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-sm font-semibold">Live swap feed</p>
        <span className="flex items-center gap-1.5 text-xs text-accent-strong">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live
        </span>
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {swaps.map((swap) => (
            <motion.div
              key={swap.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-2.5 py-1.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{swap.riderName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {swap.stationName} &middot; {swap.vehicleId}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-right">
                <div>
                  <p className="font-mono text-sm font-semibold tabular-nums">KES {swap.amount}</p>
                  <p className="text-[11px] text-muted-foreground">{timeAgo(swap.startedAt)}</p>
                </div>
                <ArrowUpRight size={14} className="text-accent-strong" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
