"use client";

import type { Address } from "@calgarywholesale/data";
import { Check, MapPin } from "lucide-react";
import { cn } from "@calgarywholesale/lib";
import { MobileSheet } from "./mobile-sheet";

export function AddressPickerSheet({
  open,
  onOpenChange,
  addresses,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: Address[];
  selectedId?: string | null;
  onSelect: (address: Address) => void;
}) {
  return (
    <MobileSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Delivery address"
      description="Where should we drop off your groceries?"
    >
      <ul className="space-y-2">
        {addresses.map((a) => {
          const active = a.id === selectedId;
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(a);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[var(--radius-md)] border p-4 text-left active:scale-[0.98]",
                  active
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] bg-[var(--surface)]",
                )}
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--primary)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{a.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {a.city}, {a.province} {a.postalCode}
                  </p>
                </div>
                {active ? (
                  <Check className="size-5 text-[var(--primary)]" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </MobileSheet>
  );
}