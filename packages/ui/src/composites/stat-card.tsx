"use client";

import * as React from "react";
import { cn } from "@calgarywholesale/lib";
import { Card, CardContent } from "../components/card";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  formatValue?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
}

function useCountUp(target: number, enabled: boolean, duration = 700) {
  const [display, setDisplay] = React.useState(enabled ? 0 : target);

  React.useEffect(() => {
    if (!enabled) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, duration]);

  return display;
}

function StatCard({
  className,
  label,
  value,
  delta,
  deltaLabel,
  formatValue,
  prefix,
  suffix,
  animate = true,
  ...props
}: StatCardProps) {
  const numeric = typeof value === "number" ? value : null;
  const counted = useCountUp(numeric ?? 0, animate && numeric !== null);
  const shown =
    numeric !== null
      ? formatValue
        ? formatValue(counted)
        : Math.round(counted).toLocaleString("en-CA")
      : value;

  const deltaPositive = delta !== undefined && delta > 0;
  const deltaNegative = delta !== undefined && delta < 0;

  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {label}
        </p>
        <p className="mt-2 font-display text-2xl font-semibold tabular tracking-tight text-[var(--foreground)]">
          {prefix}
          {shown}
          {suffix}
        </p>
        {delta !== undefined ? (
          <p
            className={cn(
              "mt-1.5 text-xs font-medium tabular",
              deltaPositive && "text-[var(--success)]",
              deltaNegative && "text-[var(--danger)]",
              !deltaPositive && !deltaNegative && "text-[var(--muted-foreground)]",
            )}
          >
            {deltaPositive ? "+" : ""}
            {delta.toLocaleString("en-CA")}
            {deltaLabel ? ` ${deltaLabel}` : ""}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { StatCard };
