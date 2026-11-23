"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock3,
  CreditCard,
  DoorOpen,
  MapPin,
  Package,
  Store,
  Truck,
} from "lucide-react";
import { brand, formatCurrency, cn } from "@westwinds/lib";
import { Button, Input, Label } from "@westwinds/ui";
import { toast } from "sonner";
import { AddressPickerSheet } from "@/components/address-sheet";
import { MobileSheet } from "@/components/mobile-sheet";
import { ScreenDock } from "@/components/screen-dock";
import { calcCartTotals } from "@/lib/cart-math";
import { getDeliveryDays } from "@/lib/delivery-slots";
import {
  nearestStore,
  storeOpenStatus,
  storesNearAddress,
  type StoreLocation,
} from "@/lib/store-locations";
import { useCartStore } from "@/stores/cart";
import {
  useCheckoutStore,
  type CheckoutStep,
  type FulfillmentMode,
  type PayMethod,
} from "@/stores/checkout";
import { useSessionStore } from "@/stores/session";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "address", label: "Address" },
  { id: "warehouse", label: "Warehouse" },
  { id: "timing", label: "Confirm" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const consumer = useSessionStore((s) => s.consumer);
  const address = useSessionStore((s) => s.address);
  const setAddress = useSessionStore((s) => s.setAddress);
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);
  const setDraft = useCheckoutStore((s) => s.setDraft);

  const days = React.useMemo(() => getDeliveryDays(), []);
  const nearby = React.useMemo(() => storesNearAddress(address), [address]);
  const [warehouseId, setWarehouseId] = React.useState(
    () => nearby[0]?.id ?? nearestStore(address).id,
  );
  const warehouse =
    nearby.find((w) => w.id === warehouseId) ?? nearby[0] ?? nearestStore(address);

  const [dayId, setDayId] = React.useState(days[0]?.id ?? "");
  const day = days.find((d) => d.id === dayId) ?? days[0]!;
  const [slotId, setSlotId] = React.useState(
    () => day.slots.find((s) => !s.full)?.id ?? day.slots[0]!.id,
  );
  const [fulfillment, setFulfillment] =
    React.useState<FulfillmentMode>("delivery");
  const [addrOpen, setAddrOpen] = React.useState(false);
  const [payOpen, setPayOpen] = React.useState(false);
  const [pay, setPay] = React.useState<PayMethod>("card");
  const [contactName, setContactName] = React.useState(consumer?.name ?? "");
  const [contactPhone, setContactPhone] = React.useState(consumer?.phone ?? "");
  const [contactEmail, setContactEmail] = React.useState(consumer?.email ?? "");
  const [deliveryNotes, setDeliveryNotes] = React.useState("");

  const totals = calcCartTotals(lines, promoCode);
  const slot = day.slots.find((s) => s.id === slotId);
  const hours = storeOpenStatus(warehouse.hours);

  React.useEffect(() => {
    if (lines.length === 0) router.replace("/cart");
  }, [lines.length, router]);

  React.useEffect(() => {
    if (!consumer) return;
    setContactName((v) => v || consumer.name);
    setContactPhone((v) => v || consumer.phone);
    setContactEmail((v) => v || consumer.email);
  }, [consumer]);

  React.useEffect(() => {
    const next = storesNearAddress(address);
    setWarehouseId(next[0]?.id ?? nearestStore(address).id);
  }, [address]);

  const goBack = () => {
    if (step === "warehouse") setStep("address");
    else if (step === "timing") setStep("warehouse");
    else router.back();
  };

  const continueFromAddress = () => {
    if (!address) {
      toast.error("Choose a delivery or pickup address");
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error("Enter your name and phone number");
      return;
    }
    setStep("warehouse");
  };

  const continueFromWarehouse = () => {
    if (!warehouse) {
      toast.error("Select a warehouse");
      return;
    }
    setStep("timing");
  };

  const continueToPayment = () => {
    if (!address || !slot || slot.full) {
      toast.error("Pick an open time slot");
      return;
    }

    setDraft({
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      deliveryNotes: deliveryNotes.trim(),
      dayId: day.id,
      dayLabel: day.label,
      slotId: slot.id,
      slotLabel: slot.label,
      address,
      payMethod: pay,
      fulfillment,
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      warehouseCode: warehouse.code,
    });

    router.push("/payment");
  };

  return (
    <div className="space-y-5 px-4 pb-28 pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Checkout
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Cart → Address → Warehouse → Confirm
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => {
          const active = s.id === step;
          const done =
            STEPS.findIndex((x) => x.id === step) > i;
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-[var(--radius-md)] px-2 py-2 text-center text-[11px] font-semibold",
                active
                  ? "bg-[var(--primary)] text-white"
                  : done
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "bg-[var(--surface)] text-[var(--muted-foreground)] shadow-[var(--shadow-card)]",
              )}
            >
              {i + 1}. {s.label}
            </li>
          );
        })}
      </ol>

      {step === "address" ? (
        <>
          <section className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg font-semibold">Your details</h2>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Full name</Label>
              <Input
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-11"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                inputMode="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="h-11"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                inputMode="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
                placeholder="For your receipt"
              />
            </div>
          </section>

          <button
            type="button"
            onClick={() => setAddrOpen(true)}
            className="flex w-full items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.98]"
          >
            <MapPin className="mt-0.5 size-5 text-[var(--primary)]" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                Address
              </p>
              <p className="font-medium">{address?.label ?? "Choose address"}</p>
              {address ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {address.line1}, {address.city}
                </p>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Used to find your nearest warehouse
                </p>
              )}
            </div>
          </button>
        </>
      ) : null}

      {step === "warehouse" ? (
        <section className="space-y-3">
          <div className="rounded-[var(--radius-lg)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
            <p className="font-semibold">Nearest warehouses</p>
            <p className="mt-0.5 text-[var(--muted-foreground)]">
              Ranked for {address?.label ?? "your address"} · store hours shown
              live
            </p>
          </div>
          <ul className="space-y-2">
            {nearby.map((w, idx) => (
              <WarehouseCard
                key={w.id}
                store={w}
                nearest={idx === 0}
                selected={w.id === warehouse.id}
                onSelect={() => setWarehouseId(w.id)}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {step === "timing" ? (
        <>
          <section className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Fulfilling from
                </p>
                <p className="font-semibold">{warehouse.name}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {warehouse.line1} · {warehouse.distanceKm} km
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  hours.open
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]",
                )}
              >
                {hours.label}
              </span>
            </div>
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <Clock3 className="size-3.5" />
              Store hours · {hours.hoursLabel}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold">How to get it</h2>
            <div className="grid grid-cols-2 gap-2">
              <FulfillChip
                active={fulfillment === "delivery"}
                icon={<Truck className="size-4" />}
                title="Delivery"
                subtitle="To your address"
                onClick={() => setFulfillment("delivery")}
              />
              <FulfillChip
                active={fulfillment === "pickup"}
                icon={<Package className="size-4" />}
                title="Pickup"
                subtitle="At warehouse"
                onClick={() => setFulfillment("pickup")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold">
              {fulfillment === "pickup" ? "Pickup window" : "Delivery slot"}
            </h2>
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

          <div className="space-y-2">
            <Label htmlFor="delivery-notes">
              {fulfillment === "pickup" ? "Pickup notes" : "Delivery notes"}
            </Label>
            <Input
              id="delivery-notes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="h-11"
              placeholder={
                fulfillment === "pickup"
                  ? "Vehicle, dock preference…"
                  : "Gate code, leave at door…"
              }
            />
          </div>

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
                {pay === "card"
                  ? "Card · Secure checkout"
                  : fulfillment === "pickup"
                    ? "Pay at pickup"
                    : "Pay at door"}
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
              <span className="text-[var(--muted-foreground)]">
                {fulfillment === "pickup" ? "Pickup" : "Delivery"}
              </span>
              <span className="tabular">
                {fulfillment === "pickup"
                  ? "Free"
                  : totals.deliveryFee === 0
                    ? "Free"
                    : formatCurrency(totals.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">
                {brand.taxLabel}
              </span>
              <span className="tabular">{formatCurrency(totals.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
              <span>Total</span>
              <span className="tabular">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </>
      ) : null}

      <ScreenDock className="inset-x-0 bottom-0 z-30">
        <div className="border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pb-6 pt-3 backdrop-blur-md">
          {step === "address" ? (
            <Button
              size="lg"
              className="h-12 w-full text-base active:scale-[0.98]"
              onClick={continueFromAddress}
            >
              Continue to nearest warehouse
            </Button>
          ) : null}
          {step === "warehouse" ? (
            <Button
              size="lg"
              className="h-12 w-full text-base active:scale-[0.98]"
              onClick={continueFromWarehouse}
            >
              Confirm timing & details
            </Button>
          ) : null}
          {step === "timing" ? (
            <Button
              size="lg"
              className="h-12 w-full text-base active:scale-[0.98]"
              disabled={!slot || slot.full}
              onClick={continueToPayment}
            >
              {pay === "card"
                ? `Continue to payment · ${formatCurrency(totals.total)}`
                : `Review & confirm · ${formatCurrency(totals.total)}`}
            </Button>
          ) : null}
        </div>
      </ScreenDock>

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
            subtitle="Pay now with Visa, Mastercard, or Amex"
            onClick={() => {
              setPay("card");
              setPayOpen(false);
            }}
          />
          <PayOption
            active={pay === "door"}
            icon={<DoorOpen className="size-5" />}
            title={fulfillment === "pickup" ? "Pay at pickup" : "Pay at door"}
            subtitle={
              fulfillment === "pickup"
                ? "Cash or tap when you collect"
                : "Cash or tap when the driver arrives"
            }
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

function WarehouseCard({
  store,
  nearest,
  selected,
  onSelect,
}: {
  store: StoreLocation;
  nearest: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const status = storeOpenStatus(store.hours);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left active:scale-[0.98]",
        selected
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-transparent bg-[var(--surface)] shadow-[var(--shadow-card)]",
      )}
    >
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow-sm">
        <Store className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-semibold">{store.name}</span>
          {nearest ? (
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
              Nearest
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm text-[var(--muted-foreground)]">
          {store.line1}, {store.city} · {store.distanceKm} km
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-semibold",
              status.open
                ? "bg-[var(--success-soft)] text-[var(--success)]"
                : "bg-[var(--danger-soft)] text-[var(--danger)]",
            )}
          >
            {status.label}
          </span>
          <span className="text-[var(--muted-foreground)]">
            {store.hours.label}
          </span>
        </span>
      </span>
    </button>
  );
}

function FulfillChip({
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
        "rounded-[var(--radius-md)] p-3 text-left active:scale-[0.98]",
        active
          ? "bg-[var(--primary)] text-white"
          : "bg-[var(--surface)] shadow-[var(--shadow-card)]",
      )}
    >
      <span className={cn("mb-2 inline-flex", active ? "opacity-90" : "text-[var(--primary)]")}>
        {icon}
      </span>
      <span className="block text-sm font-semibold">{title}</span>
      <span
        className={cn(
          "block text-xs",
          active ? "text-white/80" : "text-[var(--muted-foreground)]",
        )}
      >
        {subtitle}
      </span>
    </button>
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
