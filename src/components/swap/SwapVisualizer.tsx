"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BatteryCharging, BatteryWarning, KeyRound, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { SWAP_SEQUENCE, STEPS, type PhaseDef } from "./swapSequence";
import { useSimulateSwapMutation } from "@/store/api";
import type { StationSummary } from "@/types";

function randomBatteryId() {
  return `BAT-${Math.floor(10000 + Math.random() * 90000)}`;
}

const DOOR_OPEN_PHASES = new Set(["slot-open", "battery1-inserted", "battery1-dispensed", "battery2-inserted", "battery2-dispensed"]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SwapVisualizer({ station }: { station: StationSummary | null }) {
  const [current, setCurrent] = useState<PhaseDef | null>(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<PhaseDef[]>([]);
  const [battery1Id] = useState(randomBatteryId);
  const [battery2Id] = useState(randomBatteryId);
  const [swapId] = useState(() => `SWP-DEMO-${Math.floor(1000 + Math.random() * 9000)}`);
  const cancelRef = useRef(false);
  const [simulateSwap] = useSimulateSwapMutation();

  useEffect(() => () => {
    cancelRef.current = true;
  }, []);

  async function start() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setLog([]);
    for (const step of SWAP_SEQUENCE) {
      if (cancelRef.current) return;
      setCurrent(step);
      setLog((prev) => [...prev, step]);
      await sleep(step.durationMs);
    }
    if (!cancelRef.current) {
      await simulateSwap(station?.id).unwrap().catch(() => undefined);
      setRunning(false);
    }
  }

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setCurrent(null);
    setLog([]);
  }

  const phase = current?.phase ?? "idle";
  const doorOpen = DOOR_OPEN_PHASES.has(phase);
  const showCharged = phase === "battery1-dispensed" || phase === "battery2-dispensed";
  const showDepleted = phase === "battery1-inserted" || phase === "battery2-inserted";
  const activeStep = current?.step ?? "Tap";

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Swap kiosk simulator</p>
          <p className="text-xs text-muted-foreground">
            {station ? `${station.name} · ${station.city}` : "Select a station to begin"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={start}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <KeyRound size={15} />
            {running ? "Swap in progress…" : "Tap key to start swap"}
          </button>
          {(running || log.length > 0) && (
            <button
              onClick={reset}
              className="rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-muted"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* step tracker */}
      <div className="mb-6 flex items-center">
        {STEPS.map((step, i) => {
          const stepIndex = STEPS.indexOf(activeStep);
          const stateClass =
            i < stepIndex ? "bg-accent text-white border-accent" : i === stepIndex ? "border-accent text-accent-strong" : "border-border text-muted-foreground";
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-semibold", stateClass)}>
                {i + 1}
              </div>
              <span className="ml-2 hidden text-xs font-medium sm:inline">{step}</span>
              {i < STEPS.length - 1 && <div className={cn("mx-2 h-px flex-1", i < stepIndex ? "bg-accent" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        {/* kiosk visual */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[200px] rounded-2xl border-4 border-slate-700/70 bg-slate-900 p-3 shadow-xl">
            <div className="mb-3 rounded-md bg-slate-950 px-2 py-2 text-center">
              <p className="font-mono text-[11px] leading-tight text-accent-strong">
                {current?.title ?? "Tap your key to begin"}
              </p>
            </div>
            <div className="relative mx-auto h-36 w-20 overflow-hidden rounded-lg border-2 border-slate-600 bg-slate-800">
              <motion.div
                className="absolute inset-x-0 top-0 z-10 h-full bg-gradient-to-b from-slate-500 to-slate-700"
                animate={{ y: doorOpen ? "-100%" : "0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showDepleted && (
                    <motion.div
                      key="depleted"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <BatteryWarning size={34} className="text-warning" />
                    </motion.div>
                  )}
                  {showCharged && (
                    <motion.div
                      key="charged"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                    >
                      <BatteryCharging size={34} className="text-accent-strong" />
                    </motion.div>
                  )}
                  {(phase === "door-closed-1" || phase === "door-closed-2") && (
                    <motion.div
                      key="charging"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.1 }}
                    >
                      <Zap size={28} className="text-electric" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">{current?.detail ?? "Awaiting rider"}</p>
          </div>

          <div className="mt-4 grid w-full grid-cols-1 gap-2 text-xs">
            <IdRow label="Swap ID" value={swapId} active={running || log.length > 0} />
            <IdRow label="Battery 1 ID" value={battery1Id} active={log.some((l) => l.step === "Collect")} />
            <IdRow label="Battery 2 ID" value={battery2Id} active={log.some((l) => l.step === "Exchange")} />
          </div>
        </div>

        {/* phase log */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phase log</p>
          <div className="space-y-2">
            {log.length === 0 && <p className="text-sm text-muted-foreground">No swap in progress. Tap the key to simulate one.</p>}
            <AnimatePresence initial={false}>
              {log.map((entry, i) => (
                <motion.div
                  key={`${entry.phase}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <span className="mt-0.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-strong">
                    {entry.step}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{entry.detail}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}

function IdRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg border px-3 py-2", active ? "border-accent/40 bg-accent-soft" : "border-border bg-surface-muted")}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-mono tabular-nums", active ? "text-accent-strong" : "text-muted-foreground")}>{active ? value : "—"}</span>
    </div>
  );
}
