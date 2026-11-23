"use client";

import { useQuery } from "@tanstack/react-query";
import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  getInvoices,
  LAKESHORE_CUSTOMER_ID,
} from "@westwinds/data";
import { cn, formatDate } from "@westwinds/lib";
import {
  EmptyState,
  Money,
  PageHeader,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";
import { FileText } from "lucide-react";

const ANCHOR = parseISO("2026-09-17");

export default function InvoicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", LAKESHORE_CUSTOMER_ID],
    queryFn: () => getInvoices({ customerId: LAKESHORE_CUSTOMER_ID }),
  });

  const invoices = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Open and paid invoices for Lakeshore Fresh on Net 30."
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices"
          message="Invoices appear after shipped or delivered Trade orders."
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Aging</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => {
                const due = parseISO(inv.dueAt);
                const days = differenceInCalendarDays(ANCHOR, due);
                const aging =
                  inv.status === "paid"
                    ? "Paid"
                    : days > 30
                      ? "30+ days"
                      : days > 0
                        ? `${days}d overdue`
                        : days === 0
                          ? "Due today"
                          : `Due in ${Math.abs(days)}d`;
                const agingClass =
                  inv.status === "paid"
                    ? "text-[var(--muted-foreground)]"
                    : days > 30
                      ? "font-medium text-[var(--danger)]"
                      : days > 0
                        ? "text-[var(--warning)]"
                        : "text-[var(--foreground)]";

                return (
                  <TableRow
                    key={inv.id}
                    className={cn(
                      inv.status === "overdue" && "bg-[var(--danger-soft)]/40",
                    )}
                  >
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell className="text-sm">{inv.orderNumber}</TableCell>
                    <TableCell className="text-sm text-[var(--muted-foreground)]">
                      {formatDate(inv.issuedAt)}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(inv.dueAt)}</TableCell>
                    <TableCell className={cn("text-sm", agingClass)}>
                      {aging}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={inv.status} showIcon={false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Money amount={inv.balanceDue} className="font-medium" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
