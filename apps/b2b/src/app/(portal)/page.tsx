"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@westwinds/lib";
import { getPromotions } from "@westwinds/data";
import {
  Button,
  Money,
  PageHeader,
  SectionCard,
  Skeleton,
  StatusBadge,
} from "@westwinds/ui";
import { Megaphone, RefreshCw, Warehouse as WarehouseIcon } from "lucide-react";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";
import {
  canChangePickup,
  isPickup,
  pickupState,
  warehouseFor,
} from "@/lib/pickups";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

export default function DashboardPage() {
  const { customer, priceGroup, isLoading: acctLoading } = useLakeshoreAccount();
  const { orders, isLoading: ordersLoading } = useLakeshoreOrders();
  const addLine = useCartStore((s) => s.addLine);

  const billing = useLakeshoreBilling();
  const promosQuery = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  const lastOrder = orders[0];
  const recent = orders.slice(0, 5);
  const openInvoices = billing.openInvoices.slice(0, 4);
  const nextPickup = orders
    .filter((o) => isPickup(o) && canChangePickup(o))
    .sort((a, b) => a.pickup!.date.localeCompare(b.pickup!.date))[0];
  const announcement =
    (promosQuery.data ?? []).find(
      (p) => p.active && (p.channel === "b2b" || p.channel === "both"),
    ) ?? null;

  const { usedPct, available, used } = billing.credit;

  const buyAgain = () => {
    if (!lastOrder) return;
    for (const line of lastOrder.lines) {
      addLine({
        productId: line.productId,
        sku: line.sku,
        name: line.name,
        qty: line.quantity,
        unitPrice: line.unitPrice,
      });
    }
    toast.success(`Added ${lastOrder.lines.length} lines from ${lastOrder.number}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.tradeName ?? customer.name}
        description={`Account ${customer.accountNumber} · ${priceGroup?.name ?? "Standard"} pricing · ${customer.terms}`}
        actions={
          <Button asChild>
            <Link href="/catalog">Browse catalog</Link>
          </Button>
        }
      />

      {announcement ? (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-4 py-3">
          <Megaphone className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--primary)]">
              {announcement.name}
            </p>
            <p className="text-sm text-[var(--foreground)]/80">
              {announcement.description}
            </p>
          </div>
        </div>
      ) : null}

      {nextPickup ? (
        <Link
          href="/pickups"
          className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--primary)]/40"
        >
          <WarehouseIcon className="size-4 shrink-0 text-[var(--primary)]" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium">
              Next pickup · {formatDate(`${nextPickup.pickup!.date}T12:00:00`)},{" "}
              {nextPickup.pickup!.window}
            </p>
            <p className="text-[var(--muted-foreground)]">
              {nextPickup.number} at {warehouseFor(nextPickup.pickup!.warehouseId).name}
            </p>
          </div>
          <StatusBadge status={pickupState(nextPickup)} />
          <span className="font-mono text-sm font-semibold tracking-widest">
            {nextPickup.pickup!.code}
          </span>
        </Link>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Credit"
          description="Available to place orders on Net terms"
          className="lg:col-span-1"
        >
          {acctLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Limit</span>
                <Money amount={customer.creditLimit} className="font-medium" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Used</span>
                <Money amount={used} className="font-medium" />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)]"
                  style={{ width: `${usedPct}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Available</span>
                <Money amount={available} className="font-semibold text-[var(--primary)]" />
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Buy again"
          description={
            lastOrder
              ? `From ${lastOrder.number} · ${formatDate(lastOrder.createdAt)}`
              : "No recent orders yet"
          }
          className="lg:col-span-2"
          actions={
            lastOrder ? (
              <Button type="button" size="sm" variant="soft" onClick={buyAgain}>
                <RefreshCw className="size-3.5" />
                Add to cart
              </Button>
            ) : null
          }
        >
          {ordersLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : lastOrder ? (
            <ul className="divide-y divide-[var(--border)] text-sm">
              {lastOrder.lines.slice(0, 4).map((line) => (
                <li
                  key={line.id}
                  className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <span className="truncate">
                    {line.name}{" "}
                    <span className="text-[var(--muted-foreground)]">
                      · {line.quantity} cs
                    </span>
                  </span>
                  <Money amount={line.lineTotal} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              Place your first Trade order to unlock buy-again.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Recent orders"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/orders">View all</Link>
            </Button>
          }
        >
          {ordersLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-[var(--primary)]"
                  >
                    <div>
                      <p className="font-medium">{order.number}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} showIcon={false} />
                      <Money amount={order.total} className="font-medium" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Open invoices"
          description={
            billing.summary.outstanding > 0
              ? `${formatCurrency(billing.summary.outstanding)} outstanding${
                  billing.summary.overdue > 0
                    ? ` · ${formatCurrency(billing.summary.overdue)} overdue`
                    : ""
                }`
              : undefined
          }
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/billing">Billing</Link>
            </Button>
          }
        >
          {billing.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : openInvoices.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              No open invoices — you are caught up.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {openInvoices.map((inv) => (
                <li key={inv.id}>
                  <Link
                    href={`/billing/invoices/${inv.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-[var(--primary)]"
                  >
                    <div>
                      <p className="font-medium">{inv.number}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Due {formatDate(inv.dueAt)} · {inv.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={inv.status} showIcon={false} />
                      <Money amount={inv.balanceDue} className="font-medium" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
