"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { B2BOrder } from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Button,
  Card,
  CardContent,
  ConfirmDialog,
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
import { CalendarClock, MapPin, Navigation, UserRound, Warehouse } from "lucide-react";
import { ReschedulePickupDialog } from "@/components/pickups/reschedule-pickup-dialog";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";
import {
  canChangePickup,
  isPickup,
  mapsUrl,
  pickupState,
  warehouseFor,
} from "@/lib/pickups";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";
import { useSessionStore } from "@/stores/session-store";

const pickupDate = (order: B2BOrder) => `${order.pickup!.date}T12:00:00`;

export default function PickupsPage() {
  const { orders, isLoading } = useLakeshoreOrders();
  const saveOrder = useOrdersOverlayStore((s) => s.addOrder);
  const user = useSessionStore((s) => s.user);
  const [rescheduling, setRescheduling] = React.useState<B2BOrder | null>(null);
  const [cancelling, setCancelling] = React.useState<B2BOrder | null>(null);

  const pickups = orders.filter(isPickup);
  const upcoming = pickups
    .filter(canChangePickup)
    .sort((a, b) => a.pickup!.date.localeCompare(b.pickup!.date));
  const past = pickups
    .filter((o) => !canChangePickup(o))
    .sort((a, b) => b.pickup!.date.localeCompare(a.pickup!.date));
  const readyCount = upcoming.filter((o) => pickupState(o) === "ready").length;

  const cancelPickup = () => {
    if (!cancelling) return;
    const now = new Date().toISOString();
    saveOrder({
      ...cancelling,
      status: "cancelled",
      updatedAt: now,
      statusHistory: [
        ...cancelling.statusHistory,
        { status: "cancelled", at: now, by: user?.name },
      ],
    });
    toast.success(`Pickup for ${cancelling.number} cancelled`);
    setCancelling(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pickups"
        description={
          readyCount
            ? `${readyCount} order${readyCount === 1 ? " is" : "s are"} packed and ready to collect.`
            : "Collect Trade orders from any Westwinds warehouse. Choose Pickup at checkout to book a slot."
        }
        actions={
          <Button asChild>
            <Link href="/catalog">New pickup order</Link>
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={Warehouse}
          title="No upcoming pickups"
          message="Choose Warehouse pickup at checkout to book a collection slot."
          action={
            <Button asChild variant="outline">
              <Link href="/catalog">Browse catalog</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((order) => {
            const p = order.pickup!;
            const wh = warehouseFor(p.warehouseId);
            const state = pickupState(order);
            return (
              <Card
                key={order.id}
                className={state === "ready" ? "border-[var(--success)]/40" : undefined}
              >
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-sm font-medium hover:text-[var(--primary)]"
                      >
                        {order.number}
                      </Link>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {order.lines.length} lines · <Money amount={order.total} />
                      </p>
                    </div>
                    <StatusBadge status={state} />
                  </div>

                  <div className="rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] px-4 py-3 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      Pickup code
                    </p>
                    <p className="font-mono text-2xl font-semibold tracking-widest">
                      {p.code}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CalendarClock className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]" />
                      <span>
                        <span className="font-medium">{formatDate(pickupDate(order))}</span>
                        {" · "}
                        {p.window}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]" />
                      <span>
                        <span className="font-medium">{wh.name}</span>
                        <br />
                        <span className="text-[var(--muted-foreground)]">
                          {wh.address.line1}, {wh.address.city} · {wh.phone}
                        </span>
                      </span>
                    </li>
                    {p.contactName ? (
                      <li className="flex gap-2">
                        <UserRound className="mt-0.5 size-4 shrink-0 text-[var(--muted-foreground)]" />
                        <span>
                          {p.contactName}
                          {p.vehicle ? (
                            <span className="text-[var(--muted-foreground)]"> · {p.vehicle}</span>
                          ) : null}
                        </span>
                      </li>
                    ) : null}
                  </ul>

                  <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="soft"
                      onClick={() => setRescheduling(order)}
                    >
                      Reschedule
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={mapsUrl(wh)} target="_blank" rel="noreferrer">
                        <Navigation className="size-3.5" />
                        Directions
                      </a>
                    </Button>
                    {state !== "ready" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-[var(--danger)]"
                        onClick={() => setCancelling(order)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {past.length ? (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Past pickups</h2>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-sm">
                      {formatDate(pickupDate(order))}
                      <span className="block text-xs text-[var(--muted-foreground)]">
                        {order.pickup!.window}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium hover:text-[var(--primary)]"
                      >
                        {order.number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {warehouseFor(order.pickup!.warehouseId).name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{order.pickup!.code}</TableCell>
                    <TableCell>
                      <StatusBadge status={pickupState(order)} showIcon={false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Money amount={order.total} className="font-medium" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}

      <ReschedulePickupDialog
        order={rescheduling}
        onOpenChange={(o) => {
          if (!o) setRescheduling(null);
        }}
      />
      <ConfirmDialog
        open={cancelling !== null}
        onOpenChange={(o) => {
          if (!o) setCancelling(null);
        }}
        title={`Cancel pickup for ${cancelling?.number ?? ""}?`}
        description="The order is cancelled and the warehouse releases the reserved stock. This can't be undone from the portal."
        confirmLabel="Cancel pickup"
        cancelLabel="Keep pickup"
        variant="danger"
        onConfirm={cancelPickup}
      />
    </div>
  );
}
