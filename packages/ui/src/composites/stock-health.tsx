"use client";

import * as React from "react";
import { cn } from "@westwinds/lib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/tooltip";

/** Flexible warehouse stock row — apps may extend freely. */
export interface WarehouseStock {
  warehouseId?: string;
  warehouseCode?: string;
  warehouseName?: string;
  code?: string;
  name?: string;
  onHand?: number;
  qty?: number;
  quantity?: number;
  reorderPoint?: number;
  reorderAt?: number;
}

export type StockHealthVariant = "dots" | "bar" | "cell";

export interface StockHealthProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: StockHealthVariant;
  warehouses?: WarehouseStock[];
  onHand?: number;
  reorderPoint?: number;
  unit?: string;
}

function getQty(w: WarehouseStock): number {
  return w.onHand ?? w.qty ?? w.quantity ?? 0;
}

function getLabel(w: WarehouseStock): string {
  return (
    w.warehouseCode ??
    w.code ??
    w.warehouseName ??
    w.name ??
    w.warehouseId ??
    "WH"
  );
}

function getReorder(w: WarehouseStock): number {
  return w.reorderPoint ?? w.reorderAt ?? 0;
}

function stockTone(onHand: number, reorder: number): string {
  if (reorder <= 0) {
    if (onHand <= 0) return "bg-[var(--danger)]";
    return "bg-[var(--success)]";
  }
  if (onHand <= 0) return "bg-[var(--danger)]";
  if (onHand <= reorder) return "bg-[var(--warning)]";
  if (onHand <= reorder * 1.5) return "bg-[var(--offer)]";
  return "bg-[var(--success)]";
}

function stockSoft(onHand: number, reorder: number): string {
  if (reorder <= 0) {
    if (onHand <= 0) return "bg-[var(--danger-soft)] text-[var(--danger)]";
    return "bg-[var(--success-soft)] text-[var(--success)]";
  }
  if (onHand <= 0) return "bg-[var(--danger-soft)] text-[var(--danger)]";
  if (onHand <= reorder) return "bg-[var(--warning-soft)] text-[var(--warning)]";
  return "bg-[var(--success-soft)] text-[var(--success)]";
}

function DotsVariant({
  warehouses,
  unit,
}: {
  warehouses: WarehouseStock[];
  unit?: string;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="inline-flex items-center gap-1.5" role="list">
        {warehouses.map((w, i) => {
          const qty = getQty(w);
          const reorder = getReorder(w);
          const label = getLabel(w);
          return (
            <Tooltip key={w.warehouseId ?? `${label}-${i}`}>
              <TooltipTrigger asChild>
                <span
                  role="listitem"
                  className={cn(
                    "inline-block h-2.5 w-2.5 rounded-full",
                    stockTone(qty, reorder),
                  )}
                  aria-label={`${label}: ${qty}${unit ? ` ${unit}` : ""}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-medium">{label}</span>
                {": "}
                <span className="tabular">
                  {qty.toLocaleString("en-CA")}
                  {unit ? ` ${unit}` : ""}
                </span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function BarVariant({
  onHand,
  reorderPoint,
  className,
}: {
  onHand: number;
  reorderPoint: number;
  className?: string;
}) {
  const max = Math.max(onHand, reorderPoint, 1);
  const fill = Math.min(100, (onHand / max) * 100);
  const reorderPct = Math.min(100, (reorderPoint / max) * 100);

  return (
    <div className={cn("w-full min-w-[72px] space-y-1", className)}>
      <div className="relative h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", stockTone(onHand, reorderPoint))}
          style={{ width: `${fill}%` }}
        />
        {reorderPoint > 0 ? (
          <div
            className="absolute inset-y-0 w-px bg-[var(--foreground)]/40"
            style={{ left: `${reorderPct}%` }}
            title={`Reorder at ${reorderPoint}`}
          />
        ) : null}
      </div>
      <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] tabular">
        <span>{onHand.toLocaleString("en-CA")}</span>
        {reorderPoint > 0 ? (
          <span>ROP {reorderPoint.toLocaleString("en-CA")}</span>
        ) : null}
      </div>
    </div>
  );
}

function CellVariant({
  onHand,
  reorderPoint,
  className,
}: {
  onHand: number;
  reorderPoint: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex min-w-[3rem] items-center justify-center rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium tabular",
        stockSoft(onHand, reorderPoint),
        className,
      )}
    >
      {onHand.toLocaleString("en-CA")}
    </div>
  );
}

function StockHealth({
  variant = "dots",
  warehouses = [],
  onHand,
  reorderPoint,
  unit,
  className,
  ...props
}: StockHealthProps) {
  const totalOnHand =
    onHand ??
    warehouses.reduce((sum, w) => sum + getQty(w), 0);
  const totalReorder =
    reorderPoint ??
    Math.max(0, ...warehouses.map(getReorder), 0);

  if (variant === "dots") {
    return (
      <div className={cn(className)} {...props}>
        <DotsVariant warehouses={warehouses} unit={unit} />
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className={cn(className)} {...props}>
        <BarVariant onHand={totalOnHand} reorderPoint={totalReorder} />
      </div>
    );
  }

  return (
    <div className={cn(className)} {...props}>
      <CellVariant onHand={totalOnHand} reorderPoint={totalReorder} />
    </div>
  );
}

export { StockHealth };
