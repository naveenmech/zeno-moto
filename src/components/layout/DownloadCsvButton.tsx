"use client";

import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { toCSV, downloadCSV } from "@/lib/csv";
import {
  useGetStationsQuery,
  useGetSwapsQuery,
  useGetFleetQuery,
  useGetWalletQuery,
} from "@/store/api";
import type { FleetPartner, StationSummary, SwapTransaction, WalletTransaction } from "@/types";

const STATION_COLUMNS: { key: keyof StationSummary; label: string }[] = [
  { key: "id", label: "Station ID" },
  { key: "name", label: "Name" },
  { key: "region", label: "Region" },
  { key: "city", label: "City" },
  { key: "status", label: "Status" },
  { key: "slotsOnline", label: "Slots online" },
  { key: "slotsTotal", label: "Slots total" },
  { key: "avgCharge", label: "Avg charge %" },
  { key: "swapsToday", label: "Swaps today" },
  { key: "uptimePct", label: "Uptime %" },
];

const SWAP_COLUMNS: { key: keyof SwapTransaction; label: string }[] = [
  { key: "id", label: "Swap ID" },
  { key: "stationName", label: "Station" },
  { key: "riderName", label: "Rider" },
  { key: "vehicleId", label: "Vehicle" },
  { key: "battery1Id", label: "Battery 1 ID" },
  { key: "battery2Id", label: "Battery 2 ID" },
  { key: "amount", label: "Amount (KES)" },
  { key: "energyKwh", label: "Energy (kWh)" },
  { key: "phase", label: "Status" },
  { key: "startedAt", label: "Started at" },
];

const FLEET_COLUMNS: { key: keyof FleetPartner; label: string }[] = [
  { key: "id", label: "Partner ID" },
  { key: "name", label: "Partner" },
  { key: "region", label: "Region" },
  { key: "vehicles", label: "Vehicles" },
  { key: "activeRiders", label: "Active riders" },
  { key: "swapsThisWeek", label: "Swaps this week" },
  { key: "status", label: "Status" },
];

const WALLET_COLUMNS: { key: keyof WalletTransaction; label: string }[] = [
  { key: "id", label: "Transaction ID" },
  { key: "riderName", label: "Rider" },
  { key: "type", label: "Type" },
  { key: "method", label: "Method" },
  { key: "amount", label: "Amount (KES)" },
  { key: "status", label: "Status" },
  { key: "timestamp", label: "Timestamp" },
];

const EXPORTS: Record<string, { label: string; file: string }> = {
  "/": { label: "Stations", file: "zeno-moto-stations" },
  "/stations": { label: "Stations", file: "zeno-moto-stations" },
  "/swap-monitor": { label: "Swap activity", file: "zeno-moto-swap-activity" },
  "/fleet": { label: "Fleet partners", file: "zeno-moto-fleet-partners" },
  "/wallet": { label: "Wallet transactions", file: "zeno-moto-wallet-transactions" },
};

export function DownloadCsvButton() {
  const pathname = usePathname();
  const exportInfo = EXPORTS[pathname];

  const { data: stations } = useGetStationsQuery(undefined, {
    skip: !exportInfo || (pathname !== "/" && pathname !== "/stations"),
  });
  const { data: swaps } = useGetSwapsQuery(100, { skip: pathname !== "/swap-monitor" });
  const { data: fleet } = useGetFleetQuery(undefined, { skip: pathname !== "/fleet" });
  const { data: wallet } = useGetWalletQuery(undefined, { skip: pathname !== "/wallet" });

  if (!exportInfo) return null;

  function handleDownload() {
    const today = new Date().toISOString().slice(0, 10);
    let csv = "";
    if (pathname === "/" || pathname === "/stations") {
      csv = toCSV(stations ?? [], STATION_COLUMNS);
    } else if (pathname === "/swap-monitor") {
      csv = toCSV(swaps ?? [], SWAP_COLUMNS);
    } else if (pathname === "/fleet") {
      csv = toCSV(fleet ?? [], FLEET_COLUMNS);
    } else if (pathname === "/wallet") {
      csv = toCSV(wallet ?? [], WALLET_COLUMNS);
    }
    downloadCSV(`${exportInfo.file}-${today}.csv`, csv);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-muted sm:flex"
      title={`Download ${exportInfo.label} CSV`}
    >
      <Download size={15} />
      <span className="hidden md:inline">Export CSV</span>
    </button>
  );
}
