import * as React from "react";
import { formatCurrency, formatQty, cn } from "@calgarywholesale/lib";

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
}

function Money({ amount, className, ...props }: MoneyProps) {
  return (
    <span className={cn("tabular", className)} {...props}>
      {formatCurrency(amount)}
    </span>
  );
}

export interface QtyProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  unit?: string;
  showUnit?: boolean;
}

function Qty({
  value,
  unit = "unit",
  showUnit = true,
  className,
  ...props
}: QtyProps) {
  return (
    <span className={cn("tabular", className)} {...props}>
      {showUnit
        ? formatQty(value, unit)
        : value.toLocaleString("en-CA")}
    </span>
  );
}

export { Money, Qty };
