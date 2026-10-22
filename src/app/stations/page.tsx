"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useGetStationsQuery } from "@/store/api";
import { StationCard } from "@/components/stations/StationCard";

const STATUS_FILTERS = ["all", "online", "degraded", "offline"] as const;

export default function StationsPage() {
  const { data: stations } = useGetStationsQuery(undefined, { pollingInterval: 5000 });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const regions = useMemo(() => {
    const set = new Set((stations ?? []).map((s) => s.region));
    return ["all", ...Array.from(set)];
  }, [stations]);
  const [region, setRegion] = useState<string>("all");

  const filtered = (stations ?? []).filter((s) => {
    if (status !== "all" && s.status !== status) return false;
    if (region !== "all" && s.region !== region) return false;
    if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.city.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All regions" : r}
              </option>
            ))}
          </select>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  status === s ? "bg-accent text-white" : "bg-surface text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {stations?.length ?? 0} stations</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
}
