import * as React from "react";
import { cn } from "@calgarywholesale/lib";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
