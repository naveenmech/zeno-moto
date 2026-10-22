"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BatteryCharging, Users, Wallet, Zap, Activity, Gauge } from "lucide-react";
import { useGetKpisQuery, useGetStationsQuery, useGetSwapsQuery } from "@/store/api";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { NetworkMap } from "@/components/dashboard/NetworkMap";
import { SwapVolumeChart } from "@/components/dashboard/SwapVolumeChart";
import { LiveSwapFeed } from "@/components/dashboard/LiveSwapFeed";

const currency = (n: number) => `KES ${Math.round(n).toLocaleString()}`;

export default function OverviewPage() {
  const { data: kpis } = useGetKpisQuery(undefined, { pollingInterval: 3000 });
  const { data: stations } = useGetStationsQuery(undefined, { pollingInterval: 5000 });
  const { data: swaps } = useGetSwapsQuery(30, { pollingInterval: 3000 });

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number>();

  useLayoutEffect(() => {
    const node = leftColumnRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setLeftColumnHeight(entries[0].contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Stations online" icon={BatteryCharging} value={kpis?.stationsOnline ?? 0} suffix={`/ ${kpis?.stationsTotal ?? 150}`} />
        <KpiCard label="Swaps today" icon={Zap} value={kpis?.swapsToday ?? 0} tone="electric" />
        <KpiCard label="Active swaps" icon={Activity} value={kpis?.activeSwaps ?? 0} tone="electric" />
        <KpiCard label="Avg swap time" icon={Gauge} value={kpis?.avgSwapSeconds ?? 0} suffix="sec" tone="warning" />
        <KpiCard label="Wallet volume" icon={Wallet} value={kpis?.walletVolumeToday ?? 0} format={currency} />
        <KpiCard label="Fleet partners" icon={Users} value={kpis?.activeFleetPartners ?? 0} tone="electric" />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <div ref={leftColumnRef} className="space-y-5 lg:col-span-2">
          <NetworkMap stations={stations ?? []} />
          <SwapVolumeChart data={kpis?.swapHistory ?? []} />
        </div>
        <LiveSwapFeed swaps={swaps ?? []} maxHeight={leftColumnHeight} />
      </div>
    </div>
  );
}
