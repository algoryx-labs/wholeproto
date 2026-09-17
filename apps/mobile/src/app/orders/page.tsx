"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { B2COrder } from "@westwinds/data";
import { getOrders } from "@westwinds/data";
import { formatCurrency, formatDate, cn } from "@westwinds/lib";
import { Skeleton, StatusBadge, Tabs, TabsContent, TabsList, TabsTrigger } from "@westwinds/ui";
import { useSessionStore } from "@/stores/session";

const ACTIVE: B2COrder["status"][] = [
  "placed",
  "confirmed",
  "packed",
  "out_for_delivery",
];

function OrderRow({ order }: { order: B2COrder }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{order.number}</p>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {formatDate(order.createdAt)}
            {order.deliverySlot ? ` · ${order.deliverySlot}` : ""}
          </p>
        </div>
        <StatusBadge status={order.status} showIcon={false} />
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span className="text-[var(--muted-foreground)]">
          {order.lines.length} item{order.lines.length === 1 ? "" : "s"}
        </span>
        <span className="font-semibold tabular">
          {formatCurrency(order.total)}
        </span>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const consumer = useSessionStore((s) => s.consumer);
  const localOrders = useSessionStore((s) => s.localOrders);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "b2c", consumer?.id],
    queryFn: () =>
      getOrders({ channel: "b2c", consumerId: consumer?.id }),
    enabled: Boolean(consumer?.id),
  });

  const seeded = (data ?? []).filter(
    (o): o is B2COrder => o.channel === "b2c",
  );
  const localIds = new Set(localOrders.map((o) => o.id));
  const all = [
    ...localOrders,
    ...seeded.filter((o) => !localIds.has(o.id)),
  ];
  const active = all.filter((o) => ACTIVE.includes(o.status));
  const past = all.filter((o) => !ACTIVE.includes(o.status));

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
        Orders
      </h1>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
          ) : active.length === 0 ? (
            <Empty label="No active orders" />
          ) : (
            active.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
          ) : past.length === 0 ? (
            <Empty label="No past orders yet" />
          ) : (
            past.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <p
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--surface)] px-4 py-10 text-center text-sm text-[var(--muted-foreground)]",
      )}
    >
      {label}
    </p>
  );
}