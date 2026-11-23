import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import { DEMO_ANCHOR, type Invoice } from "@westwinds/data";
import type { PaymentMethod, PortalPayment } from "@/stores/billing-store";

export const BILLING_TODAY = DEMO_ANCHOR;

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; referenceLabel: string; placeholder: string; note: string }
> = {
  eft: {
    label: "EFT / bank transfer",
    referenceLabel: "Bank confirmation #",
    placeholder: "e.g. TD-88231904",
    note: "Funds typically clear in 1 business day.",
  },
  pad: {
    label: "Pre-authorized debit",
    referenceLabel: "Account on file",
    placeholder: "Chequing ••4410",
    note: "Debited from the account on file within 2 business days.",
  },
  card: {
    label: "Credit card",
    referenceLabel: "Card ending",
    placeholder: "4242",
    note: "Card payments post immediately.",
  },
  cheque: {
    label: "Cheque",
    referenceLabel: "Cheque number",
    placeholder: "e.g. 001284",
    note: "Applied when the cheque is received at accounts receivable.",
  },
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function isOpen(inv: Invoice): boolean {
  return inv.balanceDue > 0.005;
}

export function daysPastDue(inv: Invoice, today = BILLING_TODAY): number {
  return differenceInCalendarDays(today, parseISO(inv.dueAt));
}

/** Payments the seed already applied to invoices, shown as history. */
export function recordedPayments(invoices: Invoice[]): PortalPayment[] {
  return invoices
    .filter((inv) => inv.amountPaid > 0)
    .map((inv) => ({
      id: `pmt-rec-${inv.id}`,
      reference: `RCPT-${inv.number.replace("INV-", "")}`,
      method: "eft" as const,
      amount: inv.amountPaid,
      allocations: [
        { invoiceId: inv.id, invoiceNumber: inv.number, amount: inv.amountPaid },
      ],
      createdAt:
        inv.paidAt ?? addDays(parseISO(inv.issuedAt), 12).toISOString(),
      source: "recorded" as const,
    }));
}

export function applyPayments(
  invoices: Invoice[],
  payments: PortalPayment[],
): Invoice[] {
  const paidById = new Map<string, { amount: number; lastAt: string }>();
  for (const p of payments) {
    for (const a of p.allocations) {
      const prev = paidById.get(a.invoiceId);
      paidById.set(a.invoiceId, {
        amount: (prev?.amount ?? 0) + a.amount,
        lastAt: prev && prev.lastAt > p.createdAt ? prev.lastAt : p.createdAt,
      });
    }
  }

  return invoices.map((inv) => {
    const extra = paidById.get(inv.id);
    if (!extra) return inv;
    const amountPaid = round2(Math.min(inv.total, inv.amountPaid + extra.amount));
    const balanceDue = round2(inv.total - amountPaid);
    const status: Invoice["status"] =
      balanceDue <= 0.005 ? "paid" : amountPaid > 0 ? "partially_paid" : inv.status;
    return {
      ...inv,
      amountPaid,
      balanceDue,
      status,
      paidAt: status === "paid" ? extra.lastAt : inv.paidAt,
    };
  });
}

export interface AgingBucket {
  key: "current" | "1-30" | "31-60" | "61+";
  label: string;
  amount: number;
  count: number;
}

export function agingBuckets(invoices: Invoice[]): AgingBucket[] {
  const buckets: AgingBucket[] = [
    { key: "current", label: "Current", amount: 0, count: 0 },
    { key: "1-30", label: "1–30 days", amount: 0, count: 0 },
    { key: "31-60", label: "31–60 days", amount: 0, count: 0 },
    { key: "61+", label: "61+ days", amount: 0, count: 0 },
  ];
  for (const inv of invoices) {
    if (!isOpen(inv)) continue;
    const d = daysPastDue(inv);
    const b = d <= 0 ? buckets[0]! : d <= 30 ? buckets[1]! : d <= 60 ? buckets[2]! : buckets[3]!;
    b.amount = round2(b.amount + inv.balanceDue);
    b.count += 1;
  }
  return buckets;
}

export function agingLabel(inv: Invoice): { text: string; tone: "muted" | "ok" | "warn" | "danger" } {
  if (!isOpen(inv)) return { text: "Paid", tone: "muted" };
  const d = daysPastDue(inv);
  if (d > 30) return { text: `${d}d overdue`, tone: "danger" };
  if (d > 0) return { text: `${d}d overdue`, tone: "warn" };
  if (d === 0) return { text: "Due today", tone: "warn" };
  return { text: `Due in ${Math.abs(d)}d`, tone: "ok" };
}

export interface StatementRow {
  id: string;
  date: string;
  type: "invoice" | "payment";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  href?: string;
}

export function buildStatement(
  invoices: Invoice[],
  payments: PortalPayment[],
  fromDate?: Date,
): { opening: number; rows: StatementRow[]; closing: number } {
  const entries: Omit<StatementRow, "balance">[] = [
    ...invoices.map((inv) => ({
      id: inv.id,
      date: inv.issuedAt,
      type: "invoice" as const,
      reference: inv.number,
      description: `Invoice for order ${inv.orderNumber}`,
      debit: inv.total,
      credit: 0,
      href: `/billing/invoices/${inv.id}`,
    })),
    ...payments.map((p) => ({
      id: p.id,
      date: p.createdAt,
      type: "payment" as const,
      reference: p.reference,
      description: `${PAYMENT_METHODS[p.method].label} · ${p.allocations
        .map((a) => a.invoiceNumber)
        .join(", ")}`,
      debit: 0,
      credit: p.amount,
    })),
  ].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  let running = 0;
  let opening = 0;
  const rows: StatementRow[] = [];
  for (const e of entries) {
    running = round2(running + e.debit - e.credit);
    if (fromDate && Date.parse(e.date) < fromDate.getTime()) {
      opening = running;
      continue;
    }
    rows.push({ ...e, balance: running });
  }
  return { opening, rows, closing: running };
}

export function nextPaymentReference(): string {
  return `PMT-${Math.floor(100000 + Math.random() * 900000)}`;
}
