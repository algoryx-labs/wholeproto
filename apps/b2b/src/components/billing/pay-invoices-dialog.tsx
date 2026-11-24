"use client";

import * as React from "react";
import { toast } from "sonner";
import type { Invoice } from "@calgarywholesale/data";
import { formatCurrency, formatDate, sleep } from "@calgarywholesale/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Money,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@calgarywholesale/ui";
import { nextPaymentReference, PAYMENT_METHODS, round2 } from "@/lib/billing";
import {
  type PaymentMethod,
  useBillingStore,
} from "@/stores/billing-store";
import { useSessionStore } from "@/stores/session-store";

export interface PayInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoices: Invoice[];
  onPaid?: () => void;
}

export function PayInvoicesDialog({
  open,
  onOpenChange,
  invoices,
  onPaid,
}: PayInvoicesDialogProps) {
  const addPayment = useBillingStore((s) => s.addPayment);
  const user = useSessionStore((s) => s.user);
  const [amounts, setAmounts] = React.useState<Record<string, string>>({});
  const [method, setMethod] = React.useState<PaymentMethod>("eft");
  const [reference, setReference] = React.useState("");
  const [memo, setMemo] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const invoiceKey = invoices.map((i) => i.id).join(",");
  React.useEffect(() => {
    if (!open) return;
    setAmounts(
      Object.fromEntries(invoices.map((i) => [i.id, i.balanceDue.toFixed(2)])),
    );
    setReference("");
    setMemo("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoiceKey]);

  const parsed = invoices.map((inv) => {
    const raw = Number.parseFloat(amounts[inv.id] ?? "0");
    const amount = Number.isFinite(raw) ? round2(raw) : 0;
    const error =
      amount < 0
        ? "Must be positive"
        : amount > inv.balanceDue + 0.005
          ? `Max ${formatCurrency(inv.balanceDue)}`
          : null;
    return { inv, amount, error };
  });
  const total = round2(parsed.reduce((s, p) => s + p.amount, 0));
  const hasError = parsed.some((p) => p.error);
  const cfg = PAYMENT_METHODS[method];

  const submit = async () => {
    const allocations = parsed
      .filter((p) => p.amount > 0)
      .map((p) => ({
        invoiceId: p.inv.id,
        invoiceNumber: p.inv.number,
        amount: p.amount,
      }));
    if (!allocations.length || hasError) return;
    setSubmitting(true);
    await sleep(600);
    const ref = nextPaymentReference();
    addPayment({
      id: `pmt-${Date.now()}`,
      reference: ref,
      method,
      amount: total,
      allocations,
      createdAt: new Date().toISOString(),
      by: user?.name,
      memo: [reference && `${cfg.referenceLabel}: ${reference}`, memo]
        .filter(Boolean)
        .join(" · ") || undefined,
      source: "portal",
    });
    setSubmitting(false);
    toast.success(
      `Payment ${ref} of ${formatCurrency(total)} applied to ${allocations.length} invoice${allocations.length === 1 ? "" : "s"}`,
    );
    onOpenChange(false);
    onPaid?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pay invoices</DialogTitle>
          <DialogDescription>
            Adjust amounts for partial payments. Payments are applied to
            invoices right away and free up available credit.
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-60 divide-y divide-[var(--border)] overflow-y-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
          {parsed.map(({ inv, error }) => (
            <li key={inv.id} className="flex items-center gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{inv.number}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Due {formatDate(inv.dueAt)} · balance{" "}
                  <Money amount={inv.balanceDue} />
                </p>
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  max={inv.balanceDue}
                  aria-label={`Amount for ${inv.number}`}
                  value={amounts[inv.id] ?? ""}
                  onChange={(e) =>
                    setAmounts((a) => ({ ...a, [inv.id]: e.target.value }))
                  }
                  className="text-right tabular"
                />
                {error ? (
                  <p className="mt-1 text-right text-[11px] text-[var(--danger)]">
                    {error}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select
              value={method}
              onValueChange={(v) => setMethod(v as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {PAYMENT_METHODS[m].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-ref">{cfg.referenceLabel}</Label>
            <Input
              id="pay-ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={cfg.placeholder}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pay-memo">Remittance note</Label>
            <Input
              id="pay-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Optional note for accounts receivable"
            />
            <p className="text-xs text-[var(--muted-foreground)]">{cfg.note}</p>
          </div>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <p className="text-sm">
            Total{" "}
            <Money amount={total} className="text-base font-semibold" />
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={submitting || hasError || total <= 0}
              onClick={() => void submit()}
            >
              {submitting ? "Processing…" : `Pay ${formatCurrency(total)}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
