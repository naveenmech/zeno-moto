import Link from "next/link";
import { BatteryCharging } from "lucide-react";
import type { StationSummary } from "@/types";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function StationCard({ station }: { station: StationSummary }) {
  return (
    <Link href={`/stations/${station.id}`}>
      <Card className="h-full p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{station.name}</p>
            <p className="text-xs text-muted-foreground">
              {station.city} &middot; {station.region}
            </p>
          </div>
          <StatusBadge status={station.status} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <BatteryCharging size={16} className="text-accent-strong" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${station.avgCharge}%` }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{station.avgCharge}%</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-surface-muted py-2">
            <p className="font-mono text-sm font-semibold tabular-nums">
              {station.slotsOnline}/{station.slotsTotal}
            </p>
            <p className="text-muted-foreground">Slots up</p>
          </div>
          <div className="rounded-lg bg-surface-muted py-2">
            <p className="font-mono text-sm font-semibold tabular-nums">{station.swapsToday}</p>
            <p className="text-muted-foreground">Swaps today</p>
          </div>
          <div className="rounded-lg bg-surface-muted py-2">
            <p className="font-mono text-sm font-semibold tabular-nums">{station.uptimePct}%</p>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
