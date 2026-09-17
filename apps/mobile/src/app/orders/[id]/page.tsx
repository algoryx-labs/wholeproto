"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ChevronLeft,
  HelpCircle,
  Phone,
  Truck,
} from "lucide-react";
import type { B2COrder, B2COrderStatus } from "@westwinds/data";
import { getOrder } from "@westwinds/data";
import { formatCurrency, cn } from "@westwinds/lib";
import { Button, ProductImage, Skeleton, StatusBadge } from "@westwinds/ui";
import { MobileSheet } from "@/components/mobile-sheet";
import { productImageSrc } from "@/lib/product-image";
import { useSessionStore } from "@/stores/session";

const STEPS: B2COrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "out_for_delivery",
];

const STEP_LABELS: Record<string, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const localOrders = useSessionStore((s) => s.localOrders);
  const updateLocalOrder = useSessionStore((s) => s.updateLocalOrder);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0.15);

  const local = localOrders.find((o) => o.id === id || o.number === id);

  const remoteQ = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: !local,
  });

  const order: B2COrder | undefined = local
    ? local
    : remoteQ.data?.channel === "b2c"
      ? remoteQ.data
      : undefined;

  const isDemoLive = Boolean(local && STEPS.includes(local.status));

  React.useEffect(() => {
    if (!local || !isDemoLive) return;
    if (local.status === "out_for_delivery" || local.status === "delivered") {
      return;
    }
    const t = setInterval(() => {
      const current = useSessionStore
        .getState()
        .localOrders.find((o) => o.id === local.id);
      if (!current) return;
      const idx = STEPS.indexOf(current.status as B2COrderStatus);
      if (idx < 0 || idx >= STEPS.length - 1) return;
      const next = STEPS[idx + 1]!;
      const at = new Date().toISOString();
      updateLocalOrder(local.id, {
        status: next,
        updatedAt: at,
        statusHistory: [...current.statusHistory, { status: next, at }],
      });
    }, 6000);
    return () => clearInterval(t);
  }, [local?.id, isDemoLive, updateLocalOrder, local]);

  React.useEffect(() => {
    if (!order || order.status !== "out_for_delivery") return;
    const t = setInterval(() => {
      setProgress((p) => (p >= 0.92 ? 0.2 : p + 0.04));
    }, 800);
    return () => clearInterval(t);
  }, [order?.status]);

  if (!order && remoteQ.isLoading) {
    return (
      <div className="space-y-4 px-4 pt-2">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-40 w-full rounded-[var(--radius-lg)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 pt-10 text-center text-[var(--muted-foreground)]">
        Order not found.
        <div className="mt-4">
          <Button asChild variant="soft">
            <Link href="/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stepIndex =
    order.status === "delivered"
      ? STEPS.length
      : Math.max(0, STEPS.indexOf(order.status as B2COrderStatus));

  return (
    <div className="space-y-5 px-4 pb-8 pt-2">
      <div className="flex items-center gap-2">
        <Link
          href="/orders"
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-semibold">
            {order.number}
          </h1>
          <StatusBadge status={order.status} className="mt-1" />
        </div>
      </div>

      <ol className="flex justify-between gap-1">
        {STEPS.map((s, i) => {
          const done = i <= stepIndex;
          return (
            <li key={s} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  "h-2 w-full rounded-full",
                  done ? "bg-[var(--primary)]" : "bg-[var(--border)]",
                )}
              />
              <span className="text-center text-[10px] font-medium text-[var(--muted-foreground)]">
                {STEP_LABELS[s]}
              </span>
            </li>
          );
        })}
      </ol>

      {(order.status === "out_for_delivery" || isDemoLive) && (
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
          <p className="mb-3 text-sm font-medium">Live route</p>
          <svg viewBox="0 0 320 140" className="h-36 w-full">
            <path
              d="M20 110 C 80 110, 90 40, 160 40 S 240 100, 300 30"
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="20" cy="110" r="6" fill="var(--primary)" />
            <circle cx="300" cy="30" r="6" fill="var(--offer)" />
            <motion.g
              animate={{
                offsetDistance: `${Math.min(95, progress * 100)}%`,
              }}
              style={{ offsetPath: "path('M20 110 C 80 110, 90 40, 160 40 S 240 100, 300 30')" }}
            >
              <Truck width={22} height={22} className="text-[var(--primary)]" />
            </motion.g>
            {/* fallback positioned van */}
            <g
              transform={`translate(${20 + progress * 260}, ${110 - progress * 80})`}
            >
              <rect
                x="-12"
                y="-8"
                width="24"
                height="14"
                rx="3"
                fill="var(--primary)"
              />
              <circle cx="-6" cy="8" r="3" fill="#1C1F1E" />
              <circle cx="6" cy="8" r="3" fill="#1C1F1E" />
            </g>
          </svg>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {order.deliverySlot ?? "Delivery window TBD"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
          <Truck className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Jordan Lee</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Your Westwinds driver
          </p>
        </div>
        <a
          href="tel:+19055550142"
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-sunken)] active:scale-[0.98]"
          aria-label="Call driver"
        >
          <Phone className="size-4" />
        </a>
      </div>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-semibold">Items</h2>
        <ul className="space-y-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
          {order.lines.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-3 text-sm"
            >
              <ProductImage
                src={productImageSrc(l.sku)}
                name={l.name}
                size="sm"
              />
              <span className="min-w-0 flex-1 truncate">
                {l.quantity}× {l.name}
              </span>
              <span className="tabular">{formatCurrency(l.lineTotal)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-[var(--border)] pt-2 font-semibold">
            <span>Total</span>
            <span className="tabular">{formatCurrency(order.total)}</span>
          </li>
        </ul>
      </section>

      <Button
        variant="outline"
        className="h-12 w-full active:scale-[0.98]"
        onClick={() => setHelpOpen(true)}
      >
        <HelpCircle className="size-4" />
        Need help?
      </Button>

      <MobileSheet
        open={helpOpen}
        onOpenChange={setHelpOpen}
        title="Order help"
        description="Prototype support options"
      >
        <ul className="space-y-2 text-sm">
          <li className="rounded-[var(--radius-md)] bg-[var(--surface-sunken)] p-4">
            Change delivery instructions
          </li>
          <li className="rounded-[var(--radius-md)] bg-[var(--surface-sunken)] p-4">
            Report a missing item
          </li>
          <li className="rounded-[var(--radius-md)] bg-[var(--surface-sunken)] p-4">
            Call support · +1 (905) 555-0142
          </li>
        </ul>
      </MobileSheet>
    </div>
  );
}