"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Clock } from "lucide-react";
import { formatDate } from "@westwinds/lib";
import {
  Button,
  Money,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@westwinds/ui";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const overlayOrder = useOrdersOverlayStore((s) => s.getOrder(params.id));
  const { orders } = useLakeshoreOrders();
  const order =
    overlayOrder ??
    orders.find((o) => o.id === params.id || o.number === params.id);

  if (!order) {
    return (
      <div className="space-y-4">
        <PageHeader title="Order not found" />
        <Button asChild variant="outline">
          <Link href="/orders">Order history</Link>
        </Button>
      </div>
    );
  }

  const pending = order.status === "pending_approval";

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <motion.div
        className="flex flex-col items-center gap-3 pt-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.span
          className={`flex size-16 items-center justify-center rounded-full ${
            pending
              ? "bg-[var(--warning-soft)] text-[var(--warning)]"
              : "bg-[var(--success-soft)] text-[var(--success)]"
          }`}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          {pending ? (
            <Clock className="size-8" />
          ) : (
            <CheckCircle2 className="size-8" />
          )}
        </motion.span>
        <PageHeader
          className="items-center text-center sm:flex-col"
          title={pending ? "Submitted for approval" : "Order confirmed"}
          description={
            pending
              ? "An Approver or Account admin on Lakeshore Fresh must approve before warehouse picking starts."
              : "Wholesale Calgary has received your order and will stage it at the Calgary Distribution Centre."
          }
        />
        <StatusBadge status={order.status} />
      </motion.div>

      <SectionCard>
        <dl className="space-y-3 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted-foreground)]">Order</dt>
            <dd className="font-semibold">{order.number}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--muted-foreground)]">Placed</dt>
            <dd>{formatDate(order.createdAt)}</dd>
          </div>
          {order.poNumber ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted-foreground)]">PO</dt>
              <dd>{order.poNumber}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3">
            <dt className="text-[var(--muted-foreground)]">Total</dt>
            <dd>
              <Money amount={order.total} className="text-lg font-semibold" />
            </dd>
          </div>
        </dl>
      </SectionCard>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={`/orders/${order.id}`}>View order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/catalog">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
