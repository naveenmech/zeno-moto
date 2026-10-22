import { cn } from "@/lib/cn";

const STATUS_STYLES: Record<string, string> = {
  online: "bg-accent-soft text-accent-strong",
  active: "bg-accent-soft text-accent-strong",
  success: "bg-accent-soft text-accent-strong",
  full: "bg-accent-soft text-accent-strong",
  charging: "bg-electric-soft text-electric",
  pending: "bg-electric-soft text-electric",
  onboarding: "bg-electric-soft text-electric",
  degraded: "bg-warning-soft text-warning",
  empty: "bg-warning-soft text-warning",
  offline: "bg-danger-soft text-danger",
  fault: "bg-danger-soft text-danger",
  failed: "bg-danger-soft text-danger",
  suspended: "bg-danger-soft text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        STATUS_STYLES[status] ?? "bg-surface-muted text-muted-foreground"
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
