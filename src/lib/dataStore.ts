import type {
  BatterySlot,
  FleetPartner,
  KpiSnapshot,
  SlotStatus,
  Station,
  StationSummary,
  SwapPhase,
  SwapTransaction,
  WalletTransaction,
} from "@/types";

const REGIONS: { region: string; cities: string[] }[] = [
  { region: "Nairobi", cities: ["CBD", "Westlands", "Kasarani", "Embakasi", "Ngong Road"] },
  { region: "Coast", cities: ["Mombasa Island", "Nyali", "Likoni", "Mtwapa"] },
  { region: "Nyanza", cities: ["Kisumu", "Kisii", "Homa Bay"] },
  { region: "Rift Valley", cities: ["Nakuru", "Eldoret", "Naivasha", "Kericho"] },
  { region: "Central", cities: ["Thika", "Kiambu", "Nyeri", "Murang'a"] },
  { region: "Eastern", cities: ["Machakos", "Meru", "Embu"] },
];

const RIDER_FIRST = ["Kevin", "Faith", "Brian", "Grace", "Dennis", "Mercy", "Peter", "Lilian", "Collins", "Esther", "Victor", "Joy"];
const RIDER_LAST = ["Otieno", "Wanjiru", "Mwangi", "Achieng", "Kiprop", "Njoroge", "Wambui", "Kamau", "Odhiambo", "Chebet"];
const FLEET_NAMES = ["Boda Express", "SwiftRide Logistics", "Nairobi Couriers Co-op", "Lakeside Movers", "Rift Valley Dispatch", "Coastal Freight Riders", "UrbanHop Fleet", "GreenMile Partners"];

let seed = 42;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
function id(prefix: string, n: number) {
  return `${prefix}-${n.toString().padStart(4, "0")}`;
}

function makeSlot(slotIndex: number): BatterySlot {
  const roll = rand();
  let status: SlotStatus = "charging";
  let chargeLevel = randInt(20, 99);
  if (roll < 0.55) {
    status = "full";
    chargeLevel = 100;
  } else if (roll < 0.9) {
    status = "charging";
  } else if (roll < 0.97) {
    status = "empty";
    chargeLevel = 0;
  } else {
    status = "fault";
  }
  return {
    slotIndex,
    status,
    batteryId: status === "empty" ? null : `BAT-${randInt(10000, 99999)}`,
    chargeLevel,
    temperatureC: randInt(28, 41),
    cycles: randInt(80, 900),
  };
}

function makeStation(n: number): Station {
  const r = pick(REGIONS);
  const city = pick(r.cities);
  const statusRoll = rand();
  const status = statusRoll < 0.9 ? "online" : statusRoll < 0.97 ? "degraded" : "offline";
  return {
    id: id("STN", n),
    name: `${city} Swap Hub ${n}`,
    region: r.region,
    city,
    x: Math.round(rand() * 1000) / 10,
    y: Math.round(rand() * 1000) / 10,
    status,
    swapsToday: randInt(4, 180),
    uptimePct: Math.round((status === "online" ? randInt(970, 1000) : status === "degraded" ? randInt(800, 969) : randInt(0, 300)) / 10),
    slots: Array.from({ length: 10 }, (_, i) => makeSlot(i + 1)),
  };
}

function riderName() {
  return `${pick(RIDER_FIRST)} ${pick(RIDER_LAST)}`;
}

function makeSwap(stations: Station[], n: number, phase: SwapPhase = "completed", minutesAgo = 0): SwapTransaction {
  const station = pick(stations);
  const started = new Date(Date.now() - minutesAgo * 60_000 - randInt(0, 40_000));
  const done = phase === "completed" ? new Date(started.getTime() + randInt(35, 90) * 1000) : null;
  return {
    id: id("SWP", n),
    stationId: station.id,
    stationName: station.name,
    riderName: riderName(),
    vehicleId: `ZN-${randInt(1000, 9999)}`,
    phase,
    battery1Id: `BAT-${randInt(10000, 99999)}`,
    battery2Id: `BAT-${randInt(10000, 99999)}`,
    startedAt: started.toISOString(),
    completedAt: done ? done.toISOString() : null,
    amount: randInt(180, 350),
    energyKwh: Math.round((randInt(18, 30) / 10) * 10) / 10,
  };
}

interface Store {
  stations: Station[];
  swaps: SwapTransaction[];
  fleet: FleetPartner[];
  wallet: WalletTransaction[];
  swapCounter: number;
  swapHistory: { time: string; swaps: number }[];
  totals: { energyDispensedKwh: number; walletVolumeToday: number; swapsToday: number };
}

function buildStore(): Store {
  const stations = Array.from({ length: 150 }, (_, i) => makeStation(i + 1));
  const swaps = Array.from({ length: 60 }, (_, i) => makeSwap(stations, i + 1, "completed", i * 2));
  const fleet: FleetPartner[] = FLEET_NAMES.map((name, i) => ({
    id: id("FLT", i + 1),
    name,
    region: pick(REGIONS).region,
    vehicles: randInt(12, 420),
    activeRiders: randInt(8, 380),
    swapsThisWeek: randInt(50, 2400),
    status: rand() < 0.85 ? "active" : rand() < 0.5 ? "onboarding" : "suspended",
  }));
  const wallet: WalletTransaction[] = Array.from({ length: 40 }, (_, i) => ({
    id: id("TXN", i + 1),
    riderName: riderName(),
    type: pick(["top-up", "swap-payment", "refund"] as const),
    method: pick(["UPI", "card", "wallet"] as const),
    amount: randInt(50, 1500),
    status: rand() < 0.92 ? "success" : rand() < 0.6 ? "pending" : "failed",
    timestamp: new Date(Date.now() - i * 5 * 60_000).toISOString(),
  }));
  const swapHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, "0")}:00`,
    swaps: randInt(120, 640),
  }));
  return {
    stations,
    swaps,
    fleet,
    wallet,
    swapCounter: 1000,
    swapHistory,
    totals: { energyDispensedKwh: 184320, walletVolumeToday: 612400, swapsToday: 5230 },
  };
}

type GlobalWithStore = typeof globalThis & { __zenoStore?: Store; __zenoTickStarted?: boolean };
const g = globalThis as GlobalWithStore;

function getStore(): Store {
  if (!g.__zenoStore) {
    g.__zenoStore = buildStore();
  }
  return g.__zenoStore;
}

function tick() {
  const store = getStore();
  // drift battery charge levels and occasionally complete/empty slots
  for (const station of store.stations) {
    if (station.status === "offline") continue;
    for (const slot of station.slots) {
      if (slot.status === "charging") {
        slot.chargeLevel = Math.min(100, slot.chargeLevel + randInt(1, 6));
        if (slot.chargeLevel >= 100) {
          slot.chargeLevel = 100;
          slot.status = "full";
        }
      } else if (slot.status === "empty" && rand() < 0.12) {
        slot.status = "charging";
        slot.chargeLevel = randInt(5, 15);
        slot.batteryId = `BAT-${randInt(10000, 99999)}`;
      } else if (slot.status === "full" && rand() < 0.08) {
        slot.status = "empty";
        slot.chargeLevel = 0;
        slot.batteryId = null;
        station.swapsToday += 1;
        store.totals.swapsToday += 1;
        store.totals.energyDispensedKwh += 2.1;
        store.totals.walletVolumeToday += randInt(180, 350);
      }
    }
  }
  // occasionally inject a freshly completed swap into the feed
  if (rand() < 0.4) {
    store.swapCounter += 1;
    const swap = makeSwap(store.stations, store.swapCounter, "completed", 0);
    store.swaps.unshift(swap);
    store.swaps = store.swaps.slice(0, 80);
  }
  // roll the hourly history forward occasionally
  const last = store.swapHistory[store.swapHistory.length - 1];
  last.swaps = Math.max(0, last.swaps + randInt(-15, 25));
}

function ensureTicking() {
  if (g.__zenoTickStarted) return;
  g.__zenoTickStarted = true;
  setInterval(tick, 2500);
}

ensureTicking();

export function summarize(station: Station): StationSummary {
  const slotsOnline = station.slots.filter((s) => s.status !== "fault").length;
  const avgCharge = Math.round(station.slots.reduce((sum, s) => sum + s.chargeLevel, 0) / station.slots.length);
  return {
    id: station.id,
    name: station.name,
    region: station.region,
    city: station.city,
    x: station.x,
    y: station.y,
    status: station.status,
    swapsToday: station.swapsToday,
    uptimePct: station.uptimePct,
    slotsOnline,
    slotsTotal: station.slots.length,
    avgCharge,
  };
}

export function listStations(): StationSummary[] {
  return getStore().stations.map(summarize);
}

export function getStationById(stationId: string): Station | undefined {
  return getStore().stations.find((s) => s.id === stationId);
}

export function listSwaps(limit = 25): SwapTransaction[] {
  return getStore().swaps.slice(0, limit);
}

export function listFleet(): FleetPartner[] {
  return getStore().fleet;
}

export function listWallet(): WalletTransaction[] {
  return getStore().wallet;
}

export function getKpis(): KpiSnapshot {
  const store = getStore();
  const stationsOnline = store.stations.filter((s) => s.status === "online").length;
  const activeSwaps = randInt(6, 34);
  return {
    stationsOnline,
    stationsTotal: store.stations.length,
    swapsToday: store.totals.swapsToday,
    activeSwaps,
    avgSwapSeconds: randInt(48, 72),
    energyDispensedKwh: Math.round(store.totals.energyDispensedKwh),
    walletVolumeToday: Math.round(store.totals.walletVolumeToday),
    activeFleetPartners: store.fleet.filter((f) => f.status === "active").length,
    swapHistory: store.swapHistory,
  };
}

export function recordSimulatedSwap(stationId?: string): SwapTransaction {
  const store = getStore();
  const station = stationId ? store.stations.find((s) => s.id === stationId) ?? pick(store.stations) : pick(store.stations);
  store.swapCounter += 1;
  const swap = makeSwap(store.stations, store.swapCounter, "completed", 0);
  swap.stationId = station.id;
  swap.stationName = station.name;
  store.swaps.unshift(swap);
  store.swaps = store.swaps.slice(0, 80);
  store.totals.swapsToday += 1;
  store.totals.energyDispensedKwh += swap.energyKwh;
  store.totals.walletVolumeToday += swap.amount;
  station.swapsToday += 1;
  return swap;
}
