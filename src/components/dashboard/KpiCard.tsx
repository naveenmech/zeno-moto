"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function KpiCard({
  label,
  value,
  format,
  icon: Icon,
  tone = "accent",
  suffix,
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
  icon: LucideIcon;
  tone?: "accent" | "electric" | "warning";
  suffix?: string;
}) {
  const toneClasses: Record<string, string> = {
    accent: "bg-accent-soft text-accent-strong",
    electric: "bg-electric-soft text-electric",
    warning: "bg-warning-soft text-warning",
  };
  const barClasses: Record<string, string> = {
    accent: "bg-accent",
    electric: "bg-electric",
    warning: "bg-warning",
  };

  return (
    <Card className="relative overflow-hidden p-4 pt-5 md:p-5 md:pt-6">
      <span className={cn("absolute inset-x-0 top-0 h-[3px]", barClasses[tone])} />
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-mono text-xl font-bold tabular-nums md:text-2xl"
      >
        <Counter value={value} format={format} />
        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
      </motion.div>
    </Card>
  );
}
