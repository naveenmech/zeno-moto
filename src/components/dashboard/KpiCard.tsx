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

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-mono text-xl font-semibold tabular-nums md:text-2xl"
      >
        <Counter value={value} format={format} />
        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
      </motion.div>
    </Card>
  );
}
