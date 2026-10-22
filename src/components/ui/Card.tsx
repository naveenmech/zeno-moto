import { cn } from "@/lib/cn";

export function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("card-shadow rounded-2xl border border-border bg-surface", className)} style={style}>
      {children}
    </div>
  );
}
