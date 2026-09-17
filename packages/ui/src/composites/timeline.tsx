import * as React from "react";
import { formatDate, cn } from "@westwinds/lib";
import { StatusBadge } from "./status-badge";

export interface TimelineItem {
  id?: string;
  status: string;
  label?: string;
  description?: string;
  at: Date | string | number;
  actor?: string;
}

export interface TimelineProps extends React.ComponentPropsWithoutRef<"ol"> {
  items: TimelineItem[];
}

function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-0", className)} {...props}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li
            key={item.id ?? `${item.status}-${i}`}
            className="relative flex gap-3 pb-6 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--primary)] ring-4 ring-[var(--primary-soft)]" />
              {!isLast ? (
                <span className="mt-1 w-px flex-1 bg-[var(--border)]" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={item.status} label={item.label} />
                <time className="text-xs text-[var(--muted-foreground)]">
                  {formatDate(item.at)}
                </time>
              </div>
              {item.description ? (
                <p className="text-sm text-[var(--foreground)]">
                  {item.description}
                </p>
              ) : null}
              {item.actor ? (
                <p className="text-xs text-[var(--subtle-foreground)]">
                  {item.actor}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { Timeline };
