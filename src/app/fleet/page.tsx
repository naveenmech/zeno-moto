"use client";

import { Users2 } from "lucide-react";
import { useGetFleetQuery } from "@/store/api";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function FleetPage() {
  const { data: fleet } = useGetFleetQuery(undefined, { pollingInterval: 10000 });

  const totals = (fleet ?? []).reduce(
    (acc, f) => ({ vehicles: acc.vehicles + f.vehicles, riders: acc.riders + f.activeRiders }),
    { vehicles: 0, riders: 0 }
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Fleet partners</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{fleet?.length ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total vehicles</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{totals.vehicles.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active riders</p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{totals.riders.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Partner</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Vehicles</th>
              <th className="px-4 py-3 font-medium">Active riders</th>
              <th className="px-4 py-3 font-medium">Swaps / week</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(fleet ?? []).map((partner) => (
              <tr key={partner.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-soft text-electric">
                      <Users2 size={15} />
                    </span>
                    <span className="font-medium">{partner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{partner.region}</td>
                <td className="px-4 py-3 font-mono tabular-nums">{partner.vehicles}</td>
                <td className="px-4 py-3 font-mono tabular-nums">{partner.activeRiders}</td>
                <td className="px-4 py-3 font-mono tabular-nums">{partner.swapsThisWeek.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={partner.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
