"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { brand, formatDate } from "@calgarywholesale/lib";
import {
  Button,
  Money,
  PageHeader,
  SectionCard,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { Printer, Wallet } from "lucide-react";
import { PayInvoicesDialog } from "@/components/billing/pay-invoices-dialog";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";
import { agingLabel, isOpen, PAYMENT_METHODS } from "@/lib/billing";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const { customer } = useLakeshoreAccount();
  const { invoices, payments, isLoading } = useLakeshoreBilling();
  const { orders } = useLakeshoreOrders();
  const [payOpen, setPayOpen] = React.useState(false);

  const invoice = invoices.find(
    (i) => i.id === params.id || i.number === params.id,
  );

  if (isLoading && !invoice) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        <PageHeader title="Invoice not found" />
        <Button asChild variant="outline">
          <Link href="/billing">Back to billing</Link>
        </Button>
      </div>
    );
  }

  const order = orders.find((o) => o.id === invoice.orderId);
  const applied = payments.flatMap((p) =>
    p.allocations
      .filter((a) => a.invoiceId === invoice.id)
      .map((a) => ({ payment: p, amount: a.amount })),
  );
  const open = isOpen(invoice);
  const age = agingLabel(invoice);
  const billTo =
    customer.locations.find((l) => l.isDefault) ?? customer.locations[0]!;

  return (
    <div className="space-y-6">
      <PageHeader
        title={invoice.number}
        description={`Issued ${formatDate(invoice.issuedAt)} · ${customer.terms} · ${age.text}`}
        breadcrumbs={[
          { label: "Billing", href: "/billing" },
          { label: invoice.number },
        ]}
        actions={
          <>
            <StatusBadge status={invoice.status} />
            <Button
              type="button"
              variant="outline"
              className="print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5" />
              Print
            </Button>
            {open ? (
              <Button
                type="button"
                className="print:hidden"
                onClick={() => setPayOpen(true)}
              >
                <Wallet className="size-3.5" />
                Pay <Money amount={invoice.balanceDue} />
              </Button>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Bill to">
          <dl className="space-y-1 text-sm">
            <dd className="font-medium">{customer.name}</dd>
            <dd>{billTo.line1}</dd>
            <dd>
              {billTo.city}, {billTo.province} {billTo.postalCode}
            </dd>
            <dd className="pt-2 text-[var(--muted-foreground)]">
              Account {customer.accountNumber} · GST/BN {customer.hstNumber}
            </dd>
          </dl>
        </SectionCard>

        <SectionCard title="Details">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted-foreground)]">Order</dt>
              <dd>
                <Link
                  href={`/orders/${invoice.orderId}`}
                  className="font-medium hover:text-[var(--primary)]"
                >
                  {invoice.orderNumber}
                </Link>
              </dd>
            </div>
            {order?.poNumber ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">PO</dt>
                <dd>{order.poNumber}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted-foreground)]">Due</dt>
              <dd className="font-medium">{formatDate(invoice.dueAt)}</dd>
            </div>
            {invoice.paidAt ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">Paid</dt>
                <dd>{formatDate(invoice.paidAt)}</dd>
              </div>
            ) : null}
            {invoice.quickbooksSyncedAt ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted-foreground)]">Accounting sync</dt>
                <dd>{formatDate(invoice.quickbooksSyncedAt)}</dd>
              </div>
            ) : null}
          </dl>
        </SectionCard>

        <SectionCard title="Balance">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
              <dd><Money amount={invoice.subtotal} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">{brand.taxLabel}</dt>
              <dd><Money amount={invoice.taxAmount} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Total</dt>
              <dd><Money amount={invoice.total} className="font-medium" /></dd>
            </div>
            <div className="flex justify-between text-[var(--success)]">
              <dt>Paid</dt>
              <dd><Money amount={-invoice.amountPaid} /></dd>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
              <dt>Balance due</dt>
              <dd><Money amount={invoice.balanceDue} /></dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard title="Lines">
        {order ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit</TableHead>
                <TableHead className="text-right">Line</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-mono text-xs">{line.sku}</TableCell>
                  <TableCell>{line.name}</TableCell>
                  <TableCell className="text-right tabular">
                    {line.quantity} {line.uom}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={line.unitPrice} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={line.lineTotal} className="font-medium" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </SectionCard>

      <SectionCard title="Payments applied">
        {applied.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            No payments applied yet.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)] text-sm">
            {applied.map(({ payment, amount }) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{payment.reference}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(payment.createdAt)} ·{" "}
                    {PAYMENT_METHODS[payment.method].label}
                    {payment.by ? ` · ${payment.by}` : ""}
                  </p>
                </div>
                <Money amount={amount} className="font-medium text-[var(--success)]" />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <PayInvoicesDialog
        open={payOpen}
        onOpenChange={setPayOpen}
        invoices={open ? [invoice] : []}
      />
    </div>
  );
}
