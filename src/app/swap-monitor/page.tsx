"use client";

import { useState } from "react";
import { useGetStationsQuery, useGetSwapsQuery } from "@/store/api";
import { SwapVisualizer } from "@/components/swap/SwapVisualizer";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

function timeAgo(iso: string) {
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export default function SwapMonitorPage() {
  const { data: stations } = useGetStationsQuery(undefined, { pollingInterval: 8000 });
  const { data: swaps } = useGetSwapsQuery(20, { pollingInterval: 3000 });
  const [stationId, setStationId] = useState<string>("");

  const selected = (stations ?? []).find((s) => s.id === stationId) ?? stations?.[0] ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-sm text-muted-foreground">
          Simulate the full tap-to-dispense swap flow and watch it land in the live network feed.
        </p>
        <select
          value={selected?.id ?? ""}
          onChange={(e) => setStationId(e.target.value)}
          className="w-full min-w-0 max-w-full rounded-lg border border-border bg-surface px-3 py-2 text-base outline-none focus:border-accent sm:w-auto sm:shrink-0 sm:text-sm"
        >
          {(stations ?? []).slice(0, 40).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <SwapVisualizer station={selected} />

      <div>
        <p className="mb-3 text-sm font-semibold">Network swap activity</p>
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Station</th>
                <th className="px-4 py-3 font-medium">Batteries</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {(swaps ?? []).map((swap) => (
                <tr key={swap.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{swap.riderName}</p>
                    <p className="text-xs text-muted-foreground">{swap.vehicleId}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{swap.stationName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {swap.battery1Id} / {swap.battery2Id}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">KES {swap.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={swap.phase === "completed" ? "success" : "pending"} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{timeAgo(swap.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
