import * as React from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@calgarywholesale/lib";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: React.ReactNode;
}

function EmptyState({
  className,
  icon: Icon = Inbox,
  title,
  message,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
        <Icon className="h-6 w-6" />
      </span>
      {title ? (
        <h3 className="font-display text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      ) : null}
      <p className="max-w-sm text-sm text-[var(--muted-foreground)]">{message}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
