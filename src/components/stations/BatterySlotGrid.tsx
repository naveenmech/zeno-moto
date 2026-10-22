"use client";

import { motion } from "framer-motion";
import type { BatterySlot } from "@/types";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

const FILL_COLOR: Record<BatterySlot["status"], string> = {
  charging: "bg-electric",
  full: "bg-accent",
  empty: "bg-surface-muted",
  fault: "bg-danger",
};

function SlotGlyph({ slot }: { slot: BatterySlot }) {
  return (
    <div className="flex h-16 w-9 flex-col items-center justify-end rounded-md border-2 border-border bg-surface-muted p-0.5">
      <div className="h-full w-full overflow-hidden rounded-sm bg-surface-muted">
        <motion.div
          initial={false}
          animate={{ height: `${slot.chargeLevel}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("w-full", FILL_COLOR[slot.status])}
          style={{ marginTop: "auto" }}
        />
      </div>
    </div>
  );
}

export function BatterySlotGrid({ slots }: { slots: BatterySlot[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {slots.map((slot) => (
        <Card key={slot.slotIndex} className="flex flex-col items-center gap-2.5 p-3.5">
          <div className="flex w-full items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Slot {slot.slotIndex.toString().padStart(2, "0")}</span>
            <StatusBadge status={slot.status} />
          </div>
          <div className="flex w-full flex-1 items-center justify-center py-1">
            <SlotGlyph slot={slot} />
          </div>
          <div className="w-full text-center">
            <p className="font-mono text-sm font-semibold tabular-nums">{slot.chargeLevel}%</p>
            <p className="truncate text-[11px] text-muted-foreground">{slot.batteryId ?? "No battery"}</p>
            <p className="text-[11px] text-muted-foreground">{slot.temperatureC}&deg;C &middot; {slot.cycles} cyc</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
