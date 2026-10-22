export type StationStatus = "online" | "degraded" | "offline";
export type SlotStatus = "charging" | "full" | "empty" | "fault";

export interface BatterySlot {
  slotIndex: number; // 1-10
  status: SlotStatus;
  batteryId: string | null;
  chargeLevel: number; // 0-100
  temperatureC: number;
  cycles: number;
}

export interface Station {
  id: string;
  name: string;
  region: string;
  city: string;
  x: number; // 0-100, relative map position
  y: number; // 0-100, relative map position
  status: StationStatus;
  swapsToday: number;
  uptimePct: number;
  slots: BatterySlot[];
}

export interface StationSummary {
  id: string;
  name: string;
  region: string;
  city: string;
  x: number;
  y: number;
  status: StationStatus;
  swapsToday: number;
  uptimePct: number;
  slotsOnline: number;
  slotsTotal: number;
  avgCharge: number;
}

export type SwapPhase =
  | "tapped"
  | "slot-assigned"
  | "battery1-collected"
  | "battery1-exchanged"
  | "battery2-dispensed"
  | "completed";

export interface SwapTransaction {
  id: string;
  stationId: string;
  stationName: string;
  riderName: string;
  vehicleId: string;
  phase: SwapPhase;
  battery1Id: string;
  battery2Id: string;
  startedAt: string;
  completedAt: string | null;
  amount: number;
  energyKwh: number;
}

export interface KpiSnapshot {
  stationsOnline: number;
  stationsTotal: number;
  swapsToday: number;
  activeSwaps: number;
  avgSwapSeconds: number;
  energyDispensedKwh: number;
  walletVolumeToday: number;
  activeFleetPartners: number;
  swapHistory: { time: string; swaps: number }[];
}

export interface FleetPartner {
  id: string;
  name: string;
  region: string;
  vehicles: number;
  activeRiders: number;
  swapsThisWeek: number;
  status: "active" | "onboarding" | "suspended";
}

export interface WalletTransaction {
  id: string;
  riderName: string;
  type: "top-up" | "swap-payment" | "refund";
  method: "UPI" | "card" | "wallet";
  amount: number;
  status: "success" | "pending" | "failed";
  timestamp: string;
}
