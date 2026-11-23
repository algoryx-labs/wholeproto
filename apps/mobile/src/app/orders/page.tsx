"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock3, MapPin, Store } from "lucide-react";
import type { B2COrder } from "@westwinds/data";
import { getOrders } from "@westwinds/data";
import { formatCurrency, formatDate, cn } from "@westwinds/lib";
import {
  Skeleton,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@westwinds/ui";
import { isPickupOrder } from "@/lib/place-order";
import {
  nearestStore,
  storeOpenStatus,
  storesNearAddress,
} from "@/lib/store-locations";
import { useSessionStore } from "@/stores/session";

const ACTIVE: B2COrder["status"][] = [
  "placed",
  "confirmed",
  "packed",
  "out_for_delivery",
];

function OrderRow({ order }: { order: B2COrder }) {
  const pickup = isPickupOrder(order);
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
          <p className="mt-1 text-[11px] font-medium text-[var(--accent)]">
            {pickup ? "Pickup order" : "Delivery order"}
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
  const address = useSessionStore((s) => s.address);
  const localOrders = useSessionStore((s) => s.localOrders);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "b2c", consumer?.id],
    queryFn: () => getOrders({ channel: "b2c", consumerId: consumer?.id }),
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

  const upcoming = all.filter(
    (o) => ACTIVE.includes(o.status) && !isPickupOrder(o),
  );
  const pickups = all.filter(
    (o) => ACTIVE.includes(o.status) && isPickupOrder(o),
  );
  const past = all.filter((o) => !ACTIVE.includes(o.status));

  const nearest = nearestStore(address);
  const nearby = storesNearAddress(address).slice(0, 2);
  const hours = storeOpenStatus(nearest.hours);

  return (
    <div className="space-y-4 bg-white px-4 pb-4 pt-2">
      <h1 className="text-[22px] font-bold tracking-[-0.03em]">Orders</h1>

      <section className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3 border-b border-[var(--border)] px-4 py-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
            <Store className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{nearest.name}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  hours.open
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]",
                )}
              >
                {hours.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
              Nearest warehouse · {nearest.distanceKm} km
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <Clock3 className="size-3.5" />
              Open {nearest.hours.label}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <MapPin className="size-3.5" />
              {nearest.line1}, {nearest.city}
            </p>
          </div>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {nearby.map((s) => {
            const st = storeOpenStatus(s.hours);
            return (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {s.distanceKm} km · {s.hours.label}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[11px] font-semibold",
                    st.open ? "text-[var(--success)]" : "text-[var(--danger)]",
                  )}
                >
                  {st.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-semibold">Pickup map</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Calgary warehouses · find your pickup spot
            </p>
          </div>
          <MapPin className="size-4 shrink-0 text-[var(--accent)]" />
        </div>
        <div className="relative h-48 w-full overflow-hidden border-t border-[var(--border)] bg-[var(--surface-sunken)]">
          <iframe
            title="Calgary pickup map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d335002.3053092826!2d-114.41746962798275!3d51.02759156177822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB%2C%20Canada!5e1!3m2!1sen!2sin!4v1795462935130!5m2!1sen!2sin"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="px-4 py-2.5 text-[11px] text-[var(--muted-foreground)]">
          Pickup at {nearest.name} · {nearest.line1}, {nearest.city}
        </p>
      </section>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pickup">Pickup</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
          ) : upcoming.length === 0 ? (
            <Empty label="No upcoming delivery orders" />
          ) : (
            upcoming.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </TabsContent>
        <TabsContent value="pickup" className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
          ) : pickups.length === 0 ? (
            <Empty label="No pickup orders yet" />
          ) : (
            pickups.map((o) => <OrderRow key={o.id} order={o} />)
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
