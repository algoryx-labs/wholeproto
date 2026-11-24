"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@calgarywholesale/lib";
import { Button } from "../components/button";
import { Input } from "../components/input";

export interface QuantityStepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  disabled = false,
  className,
  ...props
}: QuantityStepperProps) {
  const set = (next: number) => {
    onChange(clamp(next, min, max));
  };

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={disabled || value <= min}
        onClick={() => set(value - step)}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) set(n);
        }}
        className="h-8 w-14 px-1 text-center tabular"
        aria-label="Quantity"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={disabled || value >= max}
        onClick={() => set(value + step)}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export { QuantityStepper };
