"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export function Counter({
  value,
  format,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prev.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = format ? format(v) : Math.round(v).toLocaleString();
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, format]);

  return <span ref={ref} className={className}>0</span>;
}
