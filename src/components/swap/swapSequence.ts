export type VisualPhase =
  | "idle"
  | "tapped"
  | "slot-open"
  | "battery1-inserted"
  | "door-closed-1"
  | "battery1-dispensed"
  | "battery2-inserted"
  | "door-closed-2"
  | "battery2-dispensed"
  | "complete";

export interface PhaseDef {
  phase: VisualPhase;
  step: "Tap" | "Collect" | "Exchange" | "Dispense" | "Complete";
  title: string;
  detail: string;
  durationMs: number;
}

export const SWAP_SEQUENCE: PhaseDef[] = [
  { phase: "tapped", step: "Tap", title: "Key tap detected", detail: "Identifying rider and vehicle…", durationMs: 1100 },
  { phase: "slot-open", step: "Collect", title: "Slot B7 assigned — door open", detail: "Insert depleted Battery 1 into the empty bay", durationMs: 1500 },
  { phase: "battery1-inserted", step: "Collect", title: "Battery 1 detected", detail: "Reading battery ID and health…", durationMs: 1100 },
  { phase: "door-closed-1", step: "Collect", title: "Door closed — Battery 1 collected", detail: "Depleted battery secured for charging", durationMs: 1300 },
  { phase: "battery1-dispensed", step: "Exchange", title: "Door open — fully charged battery ready", detail: "Take the charged replacement for Battery 1", durationMs: 1500 },
  { phase: "battery2-inserted", step: "Exchange", title: "Battery 2 inserted", detail: "Insert your second depleted battery", durationMs: 1300 },
  { phase: "door-closed-2", step: "Exchange", title: "Door closed — Battery 2 collected", detail: "Reading battery ID and health…", durationMs: 1300 },
  { phase: "battery2-dispensed", step: "Dispense", title: "Door open — second battery charged", detail: "Take the fully charged Battery 2", durationMs: 1500 },
  { phase: "complete", step: "Complete", title: "Swap complete", detail: "Ride safe — swap logged to the network", durationMs: 1000 },
];

export const STEPS: PhaseDef["step"][] = ["Tap", "Collect", "Exchange", "Dispense", "Complete"];
