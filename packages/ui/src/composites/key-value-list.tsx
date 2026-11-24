import * as React from "react";
import { cn } from "@calgarywholesale/lib";

export interface KeyValueItem {
  key: string;
  label: string;
  value: React.ReactNode;
}

export interface KeyValueListProps
  extends React.HTMLAttributes<HTMLDListElement> {
  items: KeyValueItem[];
  columns?: 1 | 2;
}

function KeyValueList({
  items,
  columns = 1,
  className,
  ...props
}: KeyValueListProps) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-3",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div key={item.key} className="min-w-0 space-y-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {item.label}
          </dt>
          <dd className="text-sm text-[var(--foreground)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export { KeyValueList };
