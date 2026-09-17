"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, DoorOpen, MapPin } from "lucide-react";
import type { B2COrder, OrderLine } from "@westwinds/data";
import { HST_RATE, warehouses } from "@westwinds/data";
import { brand, formatCurrency, cn } from "@westwinds/lib";
import { Button } from "@westwinds/ui";
import { toast } from "sonner";
import { AddressPickerSheet } from "@/components/address-sheet";
import { MobileSheet } from "@/components/mobile-sheet";
import { calcCartTotals, round2 } from "@/lib/cart-math";
import { getDeliveryDays } from "@/lib/delivery-slots";
import { useCartStore } from "@/stores/cart";
import { useSessionStore } from "@/stores/session";

type PayMethod = "card" | "door";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const clear = useCartStore((s) => s.clear);
  const consumer = useSessionStore((s) => s.consumer);
  const address = useSessionStore((s) => s.address);
  const setAddress = useSessionStore((s) => s.setAddress);
  const addLocalOrder = useSessionStore((s) => s.addLocalOrder);

  const days = React.useMemo(() => getDeliveryDays(), []);
  const [dayId, setDayId] = React.useState(days[0]?.id ?? "");
  const day = days.find((d) => d.id === dayId) ?? days[0]!;
  const [slotId, setSlotId] = React.useState(
    () => day.slots.find((s) => !s.full)?.id ?? day.slots[0]!.id,
  );
  const [addrOpen, setAddrOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [pay, setPay] = React.useState<PayMethod>("card");
  const [placing, setPlacing] = React.useState(false);

  const totals = calcCartTotals(lines, promoCode);
  const slot = day.slots.find((s) => s.id === slotId);

  React.useEffect(() => {
    if (lines.length === 0) router.replace("/cart");
  }, [lines.length, router]);

  const placeOrder = async () => {
    if (!consumer || !address || !slot || slot.full) {
      toast.error("Pick an open delivery slot and address");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1400));

    const now = new Date().toISOString();
    const seq = String(Math.floor(10000 + Math.random() * 89999));
    const number = `WW-C-${seq}`;
    const orderLines: OrderLine[] = lines.map((l, i) => ({
      id: `ol-${seq}-${i}`,
      productId: l.productId,
      sku: l.sku,
      name: l.name,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      lineTotal: round2(l.unitPrice * l.quantity),
      uom: "unit",
    }));

    const order: B2COrder = {
      id: `ord-local-${seq}`,
      number,
      channel: "b2c",
      status: "placed",
      consumerId: consumer.id,
      consumerName: consumer.name,
      warehouseId: warehouses[0]!.id,
      lines: orderLines,
      subtotal: totals.subtotal,
      taxRate: HST_RATE,
      taxAmount: totals.tax,
      total: totals.total,
      paymentStatus: pay === "card" ? "paid" : "unpaid",
      deliveryAddress: address,
      deliverySlot: `${day.label} · ${slot.label}`,
      promoCode: totals.promoApplied ? promoCode ?? undefined : undefined,
      discountAmount: totals.discount || undefined,
      notes: pay === "door" ? "Pay at door" : "Card ending 4242",
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: "placed", at: now }],
    };

    addLocalOrder(order);
    clear();
    setPlacing(false);
    router.replace(`/order-success/${order.id}`);
  };

  return (
    <div className="space-y-5 px-4 pb-28 pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
          Checkout
        </h1>
      </div>

      <button
        type="button"
        onClick={() => setAddrOpen(true)}
        className="flex w-full items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.98]"
      >
        <MapPin className="mt-0.5 size-5 text-[var(--primary)]" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Deliver to
          </p>
          <p className="font-medium">{address?.label ?? "Choose address"}</p>
          {address ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              {address.line1}, {address.city}
            </p>
          ) : null}
        </div>
      </button>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Delivery slot</h2>
        <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDayId(d.id);
                const open = d.slots.find((s) => !s.full);
                setSlotId(open?.id ?? d.slots[0]!.id);
              }}
              className={cn(
                "min-w-[76px] rounded-[var(--radius-md)] px-3 py-3 text-center active:scale-[0.98]",
                d.id === dayId
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] shadow-[var(--shadow-card)]",
              )}
            >
              <div className="text-xs opacity-80">{d.short}</div>
              <div className="text-sm font-semibold">{d.date}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {day.slots.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={s.full}
              onClick={() => setSlotId(s.id)}
              className={cn(
                "h-12 rounded-[var(--radius-md)] text-sm font-medium active:scale-[0.98]",
                s.full && "cursor-not-allowed opacity-40",
                s.id === slotId && !s.full
                  ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--primary)]"
                  : "bg-[var(--surface)] shadow-[var(--shadow-card)]",
              )}
            >
              {s.label}
              {s.full ? " · Full" : ""}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setPayOpen(true)}
        className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.98]"
      >
        {pay === "card" ? (
          <CreditCard className="size-5 text-[var(--primary)]" />
        ) : (
          <DoorOpen className="size-5 text-[var(--primary)]" />
        )}
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Payment
          </p>
          <p className="font-medium">
            {pay === "card" ? "Visa ···· 4242" : "Pay at door"}
          </p>
        </div>
      </button>

      <div className="space-y-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-sm shadow-[var(--shadow-card)]">
        <div className="flex justify-between">
          <span className="text-[var(--muted-foreground)]">Subtotal</span>
          <span className="tabular">{formatCurrency(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 ? (
          <div className="flex justify-between text-[var(--success)]">
            <span>FRESH10</span>
            <span className="tabular">−{formatCurrency(totals.discount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className="text-[var(--muted-foreground)]">Delivery</span>
          <span className="tabular">
            {totals.deliveryFee === 0
              ? "Free"
              : formatCurrency(totals.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted-foreground)]">{brand.taxLabel}</span>
          <span className="tabular">{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
          <span>Total</span>
          <span className="tabular">{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pb-6 pt-3 backdrop-blur-md">
        <Button
          size="lg"
          className="h-12 w-full text-base active:scale-[0.98]"
          disabled={placing || !slot || slot.full}
          onClick={placeOrder}
        >
          {placing ? "Placing order…" : `Place order · ${formatCurrency(totals.total)}`}
        </Button>
      </div>

      <AddressPickerSheet
        open={addrOpen}
        onOpenChange={setAddrOpen}
        addresses={consumer?.addresses ?? []}
        selectedId={address?.id}
        onSelect={setAddress}
      />

      <MobileSheet
        open={payOpen}
        onOpenChange={setPayOpen}
        title="Payment method"
        description="Prototype only — no real charges."
      >
        <div className="space-y-2">
          <PayOption
            active={pay === "card"}
            icon={<CreditCard className="size-5" />}
            title="Card"
            subtitle="Visa ending 4242"
            onClick={() => {
              setPay("card");
              setPayOpen(false);
            }}
          />
          <PayOption
            active={pay === "door"}
            icon={<DoorOpen className="size-5" />}
            title="Pay at door"
            subtitle="Cash or tap when the driver arrives"
            onClick={() => {
              setPay("door");
              setPayOpen(false);
            }}
          />
        </div>
      </MobileSheet>
    </div>
  );
}

function PayOption({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--radius-md)] border p-4 text-left active:scale-[0.98]",
        active
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-[var(--border)]",
      )}
    >
      <span className="text-[var(--primary)]">{icon}</span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-[var(--muted-foreground)]">
          {subtitle}
        </span>
      </span>
    </button>
  );
}