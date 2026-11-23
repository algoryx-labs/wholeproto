"use client";

import * as React from "react";
import Link from "next/link";
import Papa from "papaparse";
import { subDays } from "date-fns";
import type { Invoice } from "@westwinds/data";
import { cn, formatCurrency, formatDate } from "@westwinds/lib";
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Money,
  PageHeader,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  StatCard,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@westwinds/ui";
import { Download, FileText, Wallet } from "lucide-react";
import { PayInvoicesDialog } from "@/components/billing/pay-invoices-dialog";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";
import {
  agingLabel,
  BILLING_TODAY,
  buildStatement,
  daysPastDue,
  isOpen,
  PAYMENT_METHODS,
} from "@/lib/billing";

type InvoiceFilter = "open" | "overdue" | "paid" | "all";
type StatementPeriod = "30" | "60" | "90" | "all";

const AGING_TONES: Record<string, string> = {
  current: "bg-[var(--primary)]",
  "1-30": "bg-[var(--warning)]",
  "31-60": "bg-[var(--offer)]",
  "61+": "bg-[var(--danger)]",
};

const AGING_TEXT: Record<"muted" | "ok" | "warn" | "danger", string> = {
  muted: "text-[var(--muted-foreground)]",
  ok: "text-[var(--foreground)]",
  warn: "text-[var(--warning)]",
  danger: "font-medium text-[var(--danger)]",
};

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([Papa.unparse(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BillingPage() {
  const billing = useLakeshoreBilling();
  const { invoices, openInvoices, payments, aging, summary, credit, isLoading } =
    billing;

  const [filter, setFilter] = React.useState<InvoiceFilter>("open");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [payTarget, setPayTarget] = React.useState<Invoice[] | null>(null);
  const [period, setPeriod] = React.useState<StatementPeriod>("90");

  const filtered = invoices.filter((inv) =>
    filter === "all"
      ? true
      : filter === "paid"
        ? !isOpen(inv)
        : filter === "overdue"
          ? isOpen(inv) && daysPastDue(inv) > 0
          : isOpen(inv),
  );
  const selectedInvoices = openInvoices.filter((i) => selected.has(i.id));
  const selectedTotal = selectedInvoices.reduce((s, i) => s + i.balanceDue, 0);
  const selectableIds = filtered.filter(isOpen).map((i) => i.id);
  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));

  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const statement = React.useMemo(
    () =>
      buildStatement(
        invoices,
        payments,
        period === "all" ? undefined : subDays(BILLING_TODAY, Number(period)),
      ),
    [invoices, payments, period],
  );

  const exportStatement = () =>
    downloadCsv(
      `lakeshore-statement-${period}d.csv`,
      [
        { Date: "", Type: "Opening balance", Reference: "", Description: "", Debit: "", Credit: "", Balance: statement.opening.toFixed(2) },
        ...statement.rows.map((r) => ({
          Date: formatDate(r.date),
          Type: r.type === "invoice" ? "Invoice" : "Payment",
          Reference: r.reference,
          Description: r.description,
          Debit: r.debit ? r.debit.toFixed(2) : "",
          Credit: r.credit ? r.credit.toFixed(2) : "",
          Balance: r.balance.toFixed(2),
        })),
      ],
    );

  const agingTotal = aging.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Invoices, payments and account statements for Lakeshore Fresh."
        actions={
          <>
            <Button type="button" variant="outline" onClick={exportStatement}>
              <Download className="size-3.5" />
              Statement CSV
            </Button>
            <Button
              type="button"
              disabled={!openInvoices.length}
              onClick={() => setPayTarget(openInvoices)}
            >
              <Wallet className="size-3.5" />
              Pay balance
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={summary.outstanding}
          formatValue={formatCurrency}
        />
        <StatCard
          label="Overdue"
          value={summary.overdue}
          formatValue={formatCurrency}
          className={cn(summary.overdue > 0 && "border-[var(--danger)]/30")}
        />
        <StatCard
          label="Due next 7 days"
          value={summary.dueSoon}
          formatValue={formatCurrency}
        />
        <StatCard
          label="Available credit"
          value={credit.available}
          formatValue={formatCurrency}
        />
      </div>

      <SectionCard
        title="Aging"
        description={`${summary.openCount} open invoices · ${summary.overdueCount} past due`}
      >
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="space-y-3">
            <div className="flex h-3 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
              {agingTotal > 0
                ? aging.map((b) =>
                    b.amount > 0 ? (
                      <div
                        key={b.key}
                        className={AGING_TONES[b.key]}
                        style={{ width: `${(b.amount / agingTotal) * 100}%` }}
                        title={`${b.label}: ${formatCurrency(b.amount)}`}
                      />
                    ) : null,
                  )
                : null}
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {aging.map((b) => (
                <div key={b.key} className="flex items-start gap-2">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", AGING_TONES[b.key])} />
                  <div>
                    <dt className="text-xs text-[var(--muted-foreground)]">
                      {b.label} · {b.count}
                    </dt>
                    <dd>
                      <Money amount={b.amount} className="font-medium" />
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        )}
      </SectionCard>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="statement">Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["open", "Open"],
                  ["overdue", "Overdue"],
                  ["paid", "Paid"],
                  ["all", "All"],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={filter === key ? "soft" : "ghost"}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
            {selectedInvoices.length ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--muted-foreground)]">
                  {selectedInvoices.length} selected ·{" "}
                  <Money amount={selectedTotal} className="font-medium text-[var(--foreground)]" />
                </span>
                <Button type="button" size="sm" onClick={() => setPayTarget(selectedInvoices)}>
                  Pay selected
                </Button>
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={filter === "open" || filter === "overdue" ? "Nothing to pay" : "No invoices"}
              message={
                filter === "open" || filter === "overdue"
                  ? "You are all caught up on this account."
                  : "Invoices appear after shipped or delivered Trade orders."
              }
            />
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        aria-label="Select all open invoices"
                        checked={allSelected}
                        disabled={!selectableIds.length}
                        onCheckedChange={(v) =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            for (const id of selectableIds) {
                              if (v) next.add(id);
                              else next.delete(id);
                            }
                            return next;
                          })
                        }
                      />
                    </TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Aging</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inv) => {
                    const open = isOpen(inv);
                    const age = agingLabel(inv);
                    return (
                      <TableRow
                        key={inv.id}
                        className={cn(
                          open && daysPastDue(inv) > 30 && "bg-[var(--danger-soft)]/40",
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${inv.number}`}
                            disabled={!open}
                            checked={selected.has(inv.id)}
                            onCheckedChange={(v) => toggle(inv.id, v === true)}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/billing/invoices/${inv.id}`}
                            className="font-medium hover:text-[var(--primary)]"
                          >
                            {inv.number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          <Link
                            href={`/orders/${inv.orderId}`}
                            className="hover:text-[var(--primary)]"
                          >
                            {inv.orderNumber}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-[var(--muted-foreground)]">
                          {formatDate(inv.issuedAt)}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(inv.dueAt)}</TableCell>
                        <TableCell className={cn("text-sm", AGING_TEXT[age.tone])}>
                          {age.text}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={inv.status} showIcon={false} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Money amount={inv.total} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Money amount={inv.balanceDue} className="font-medium" />
                        </TableCell>
                        <TableCell className="text-right">
                          {open ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setPayTarget([inv])}
                            >
                              Pay
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          {payments.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No payments yet"
              message="Payments you make here or send to accounts receivable show up in this list."
            />
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Applied to</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm text-[var(--muted-foreground)]">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{p.reference}</p>
                        {p.memo ? (
                          <p className="text-xs text-[var(--muted-foreground)]">{p.memo}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm">
                        {PAYMENT_METHODS[p.method].label}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-wrap gap-1">
                          {p.allocations.map((a) => (
                            <Link
                              key={a.invoiceId}
                              href={`/billing/invoices/${a.invoiceId}`}
                              className="hover:text-[var(--primary)]"
                            >
                              <Badge variant="secondary">{a.invoiceNumber}</Badge>
                            </Link>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.source === "portal" ? "soft" : "outline"}>
                          {p.source === "portal" ? `Portal · ${p.by ?? "you"}` : "Received by AR"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Money amount={p.amount} className="font-medium" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="statement" className="mt-4">
          <SectionCard
            title="Account statement"
            description={`As of ${formatDate(BILLING_TODAY)} · ${statement.rows.length} transactions`}
            actions={
              <>
                <Select value={period} onValueChange={(v) => setPeriod(v as StatementPeriod)}>
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="60">Last 60 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All activity</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" variant="outline" onClick={exportStatement}>
                  <Download className="size-3.5" />
                  CSV
                </Button>
              </>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Charges</TableHead>
                  <TableHead className="text-right">Payments</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-[var(--surface-sunken)]/50">
                  <TableCell colSpan={5} className="text-sm font-medium">
                    Opening balance
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={statement.opening} className="font-medium" />
                  </TableCell>
                </TableRow>
                {statement.rows.map((r) => (
                  <TableRow key={`${r.type}-${r.id}`}>
                    <TableCell className="text-sm text-[var(--muted-foreground)]">
                      {formatDate(r.date)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {r.href ? (
                        <Link href={r.href} className="hover:text-[var(--primary)]">
                          {r.reference}
                        </Link>
                      ) : (
                        r.reference
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{r.description}</TableCell>
                    <TableCell className="text-right">
                      {r.debit ? <Money amount={r.debit} /> : "—"}
                    </TableCell>
                    <TableCell className="text-right text-[var(--success)]">
                      {r.credit ? <Money amount={-r.credit} /> : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Money amount={r.balance} className="font-medium" />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-[var(--surface-sunken)]/50">
                  <TableCell colSpan={5} className="text-sm font-semibold">
                    Closing balance
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={statement.closing} className="font-semibold" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <PayInvoicesDialog
        open={payTarget !== null}
        onOpenChange={(o) => {
          if (!o) setPayTarget(null);
        }}
        invoices={payTarget ?? []}
        onPaid={() => setSelected(new Set())}
      />
    </div>
  );
}
