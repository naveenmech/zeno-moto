"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { useGetStationQuery, useGetSwapsQuery, useSimulateSwapMutation } from "@/store/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { BatterySlotGrid } from "@/components/stations/BatterySlotGrid";

export default function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: station, isLoading } = useGetStationQuery(id, { pollingInterval: 3000 });
  const { data: swaps } = useGetSwapsQuery(60, { pollingInterval: 4000 });
  const [simulateSwap, { isLoading: simulating }] = useSimulateSwapMutation();
  const [toast, setToast] = useState<string | null>(null);

  const stationSwaps = (swaps ?? []).filter((s) => s.stationId === id).slice(0, 8);

  async function handleSimulate() {
    const result = await simulateSwap(id).unwrap();
    setToast(`Swap ${result.id} recorded for ${result.riderName}`);
    setTimeout(() => setToast(null), 3000);
  }

  if (isLoading || !station) {
    return <p className="text-sm text-muted-foreground">Loading station…</p>;
  }

  return (
    <div className="space-y-5">
      <Link href="/stations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} /> Back to stations
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-semibold">{station.name}</h2>
            <StatusBadge status={station.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {station.city}, {station.region} &middot; {station.id}
          </p>
        </div>
        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Zap size={15} />
          {simulating ? "Simulating…" : "Simulate swap here"}
        </button>
      </div>

      {toast && (
        <div className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent-strong">{toast}</div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3.5 text-center">
          <p className="font-mono text-xl font-semibold tabular-nums">{station.swapsToday}</p>
          <p className="text-xs text-muted-foreground">Swaps today</p>
        </Card>
        <Card className="p-3.5 text-center">
          <p className="font-mono text-xl font-semibold tabular-nums">{station.uptimePct}%</p>
          <p className="text-xs text-muted-foreground">Uptime</p>
        </Card>
        <Card className="p-3.5 text-center">
          <p className="font-mono text-xl font-semibold tabular-nums">{station.slots.filter((s) => s.status !== "fault").length}/10</p>
          <p className="text-xs text-muted-foreground">Slots online</p>
        </Card>
        <Card className="p-3.5 text-center">
          <p className="font-mono text-xl font-semibold tabular-nums">
            {Math.round(station.slots.reduce((a, s) => a + s.chargeLevel, 0) / station.slots.length)}%
          </p>
          <p className="text-xs text-muted-foreground">Avg charge</p>
        </Card>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">Battery slots</p>
        <BatterySlotGrid slots={station.slots} />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">Recent swaps at this station</p>
        <Card className="divide-y divide-border">
          {stationSwaps.length === 0 && <p className="p-4 text-sm text-muted-foreground">No recent swaps recorded.</p>}
          {stationSwaps.map((swap) => (
            <div key={swap.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{swap.riderName}</p>
                <p className="text-xs text-muted-foreground">{swap.vehicleId} &middot; {swap.id}</p>
              </div>
              <p className="font-mono tabular-nums">KES {swap.amount}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
