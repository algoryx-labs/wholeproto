"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@westwinds/ui";
import { useSessionStore } from "@/stores/session";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const order = useSessionStore((s) =>
    s.localOrders.find((o) => o.id === id || o.number === id),
  );

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="flex size-20 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ scale: [0.6, 1.1, 1] }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Check className="size-10" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em]"
      >
        Order placed
      </motion.h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        {order
          ? `${order.number} · ${order.deliverySlot}`
          : "Your groceries are on the way."}
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
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