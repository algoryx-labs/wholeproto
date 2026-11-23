"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, MapPin, Receipt } from "lucide-react";
import { brand, formatCurrency } from "@westwinds/lib";
import { Button, ProductImage } from "@westwinds/ui";
import { productImageSrc } from "@/lib/product-image";
import { useSessionStore } from "@/stores/session";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const order = useSessionStore((s) =>
    s.localOrders.find((o) => o.id === id || o.number === id),
  );

  const paidLabel =
    order?.paymentStatus === "paid"
      ? "Paid"
      : order?.notes?.includes("Pay at door")
        ? "Pay at door"
        : "Unpaid";

  const receiptDate = order
    ? new Date(order.createdAt).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="space-y-5 px-4 pb-10 pt-2">
      <div className="flex flex-col items-center pt-4 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="flex size-16 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.div>

        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]"
        >
          Order confirmed
        </motion.h1>
        <p className="mt-1.5 text-[var(--muted-foreground)]">
          {order
            ? `${order.number} · ${order.deliverySlot}`
            : "Your groceries are on the way."}
        </p>
      </div>

      {order ? (
        <motion.section
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between border-b border-dashed border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-3">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-[var(--primary)]" />
              <span className="text-sm font-semibold">Order receipt</span>
            </div>
            <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--success)]">
              {paidLabel}
            </span>
          </div>

          <div className="space-y-1 px-4 py-3 text-sm">
            <Row label="Merchant" value={brand.companyName} />
            <Row label="Order #" value={order.number} />
            <Row label="Date" value={receiptDate ?? "—"} />
            <Row
              label="Payment"
              value={
                order.paymentStatus === "paid"
                  ? order.notes?.match(/Card ending \w+/)?.[0] ??
                    order.notes?.match(/Apple Pay|Google Pay/)?.[0] ??
                    "Card · Paid"
                  : "Due at door"
              }
            />
          </div>

          <div className="border-t border-dashed border-[var(--border)] px-4 py-3">
            <div className="mb-2 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--primary)]" />
              <div>
                <p className="font-medium">{order.deliveryAddress.label}</p>
                <p className="text-[var(--muted-foreground)]">
                  {order.deliveryAddress.line1}
                  {order.deliveryAddress.line2
                    ? `, ${order.deliveryAddress.line2}`
                    : ""}
                </p>
                <p className="text-[var(--muted-foreground)]">
                  {order.deliveryAddress.city}, {order.deliveryAddress.province}{" "}
                  {order.deliveryAddress.postalCode}
                </p>
                {order.deliverySlot ? (
                  <p className="mt-1 text-[var(--muted-foreground)]">
                    {order.deliverySlot}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <ul className="space-y-2 border-t border-dashed border-[var(--border)] px-4 py-3">
            {order.lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3 text-sm">
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
          </ul>

          <div className="space-y-1.5 border-t border-dashed border-[var(--border)] px-4 py-3 text-sm">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
            {order.discountAmount ? (
              <Row
                label={order.promoCode ?? "Discount"}
                value={`−${formatCurrency(order.discountAmount)}`}
              />
            ) : null}
            <Row
              label={`${brand.taxLabel} (${Math.round(order.taxRate * 100)}%)`}
              value={formatCurrency(order.taxAmount)}
            />
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <p className="border-t border-dashed border-[var(--border)] px-4 py-3 text-center text-[11px] text-[var(--muted-foreground)]">
            Receipt for {order.consumerName}
            {order.notes?.includes("Email:")
              ? ` · ${order.notes.split("Email: ")[1]?.split(" · ")[0]}`
              : ""}
          </p>
        </motion.section>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="h-12 text-base active:scale-[0.98]">
          <Link href={order ? `/orders/${order.id}` : "/orders"}>
            Track order
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="soft"
          className="h-12 text-base active:scale-[0.98]"
        >
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="text-right tabular">{value}</span>
    </div>
  );
}
