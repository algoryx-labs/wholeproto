"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { cn } from "@westwinds/lib";
import { Button } from "../components/button";

export interface DemoSwitcherProps
  extends React.HTMLAttributes<HTMLDivElement> {
  adminUrl?: string;
  b2bUrl?: string;
  mobileUrl?: string;
  onReset?: () => void;
  /** When true, the switcher is not rendered (e.g. production). */
  hide?: boolean;
  defaultOpen?: boolean;
}

function DemoSwitcher({
  adminUrl,
  b2bUrl,
  mobileUrl,
  onReset,
  hide = false,
  defaultOpen = false,
  className,
  ...props
}: DemoSwitcherProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  if (hide) return null;

  const links = [
    { label: "Admin", href: adminUrl },
    { label: "B2B Trade", href: b2bUrl },
    { label: "Mobile", href: mobileUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-[100] flex flex-col items-start gap-2",
        className,
      )}
      {...props}
    >
      {open ? (
        <div className="w-56 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]">
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Demo apps
            </p>
          </div>
          <ul className="p-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                >
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                </a>
              </li>
            ))}
          </ul>
          {onReset ? (
            <div className="border-t border-[var(--border)] p-1">
              <button
                type="button"
                onClick={onReset}
                className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset demo data
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="rounded-full shadow-[var(--shadow-card)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Demo
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

export { DemoSwitcher };
