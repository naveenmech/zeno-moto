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
    <div className={cn("card-shadow rounded-[1.25rem] border border-border bg-surface", className)} style={style}>
      {children}
    </div>
  );
}
