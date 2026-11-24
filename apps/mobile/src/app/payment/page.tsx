"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  CreditCard,
  DoorOpen,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { brand, formatCurrency, cn } from "@calgarywholesale/lib";
import { Button, Input, Label } from "@calgarywholesale/ui";
import { toast } from "sonner";
import { calcCartTotals } from "@/lib/cart-math";
import { buildLocalOrder } from "@/lib/place-order";
import { ScreenDock } from "@/components/screen-dock";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { useSessionStore } from "@/stores/session";

type Phase = "form" | "processing" | "success";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const clearCart = useCartStore((s) => s.clear);
  const draft = useCheckoutStore((s) => s.draft);
  const clearDraft = useCheckoutStore((s) => s.clearDraft);
  const consumer = useSessionStore((s) => s.consumer);
  const addLocalOrder = useSessionStore((s) => s.addLocalOrder);

  const [phase, setPhase] = React.useState<Phase>("form");
  const [cardName, setCardName] = React.useState(draft?.contactName ?? "");
  const [cardNumber, setCardNumber] = React.useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = React.useState("12/28");
  const [cvc, setCvc] = React.useState("123");
  const [wallet, setWallet] = React.useState<"card" | "apple" | "google">("card");

  const totals = calcCartTotals(lines, promoCode);
  const isDoor = draft?.payMethod === "door";

  React.useEffect(() => {
    if (lines.length === 0) {
      router.replace("/cart");
      return;
    }
    if (!draft?.address || !draft.warehouseId) {
      router.replace("/checkout");
    }
  }, [lines.length, draft, router]);

  const placeAndGo = React.useCallback(
    async (cardLast4?: string) => {
      if (!draft?.address || !consumer) {
        toast.error("Checkout details missing");
        router.replace("/checkout");
        return;
      }

      setPhase("processing");
      await new Promise((r) => setTimeout(r, isDoor ? 900 : 1800));

      const order = buildLocalOrder({
        lines,
        promoCode,
        draft,
        consumerId: consumer.id,
        consumerName: consumer.name,
        cardLast4,
      });

      addLocalOrder(order);
      clearCart();
      clearDraft();
      setPhase("success");
      await new Promise((r) => setTimeout(r, 700));
      router.replace(`/order-success/${order.id}`);
    },
    [
      draft,
      consumer,
      lines,
      promoCode,
      addLocalOrder,
      clearCart,
      clearDraft,
      isDoor,
      router,
    ],
  );

  const onPay = async () => {
    if (isDoor) {
      await placeAndGo();
      return;
    }

    if (wallet === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 16) {
        toast.error("Enter a valid card number");
        return;
      }
      if (expiry.replace(/\D/g, "").length < 4) {
        toast.error("Enter a valid expiry");
        return;
      }
      if (cvc.replace(/\D/g, "").length < 3) {
        toast.error("Enter a valid CVC");
        return;
      }
      if (!cardName.trim()) {
        toast.error("Enter the name on the card");
        return;
      }
      await placeAndGo(digits.slice(-4));
      return;
    }

    await placeAndGo(wallet === "apple" ? "Apple" : "GPay");
  };

  if (!draft) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--muted-foreground)]">
        Loading payment…
      </div>
    );
  }

  return (
    <div className="relative min-h-full space-y-5 px-4 pb-28 pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={phase !== "form"}
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98] disabled:opacity-40"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            {isDoor ? "Confirm order" : "Payment"}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {brand.mobileAppName} · Mock gateway
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--success)]">
          <Lock className="size-3" />
          Secure
        </span>
      </div>

      {/* Mock gateway merchant header */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--foreground)] text-[var(--background)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider opacity-70">
              Paying
            </p>
            <p className="font-display text-lg font-semibold">
              {brand.companyName}
            </p>
          </div>
          <p className="font-display text-2xl font-semibold tabular">
            {formatCurrency(totals.total)}
          </p>
        </div>
        <div className="border-t border-white/10 px-4 py-2 text-xs opacity-70">
          {draft.fulfillment === "pickup" ? "Pickup" : "Delivery"} ·{" "}
          {draft.warehouseName} · {draft.dayLabel} · {draft.slotLabel}
        </div>
      </div>

      {isDoor ? (
        <div className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
              <DoorOpen className="size-5" />
            </div>
            <div>
              <p className="font-medium">
                {draft.fulfillment === "pickup" ? "Pay at pickup" : "Pay at door"}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {draft.fulfillment === "pickup"
                  ? "Cash or tap when you collect. No charge now."
                  : "Cash or tap when your driver arrives. No charge now."}
              </p>
            </div>
          </div>
          <OrderSummaryCompact />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <WalletChip
              active={wallet === "card"}
              label="Card"
              onClick={() => setWallet("card")}
            />
            <WalletChip
              active={wallet === "apple"}
              label="Apple Pay"
              onClick={() => setWallet("apple")}
            />
            <WalletChip
              active={wallet === "google"}
              label="G Pay"
              onClick={() => setWallet("google")}
            />
          </div>

          {wallet === "card" ? (
            <div className="space-y-4 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="relative overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-br from-[#1a3a2f] via-[#245644] to-[#0f241c] p-4 text-white">
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 right-8 size-28 rounded-full bg-white/5" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <CreditCard className="size-6 opacity-90" />
                    <span className="text-xs font-medium tracking-widest opacity-80">
                      DEMO
                    </span>
                  </div>
                  <p className="font-mono text-lg tracking-[0.18em] tabular">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between text-xs">
                    <div>
                      <p className="opacity-60">Name</p>
                      <p className="mt-0.5 font-medium uppercase tracking-wide">
                        {cardName || "YOUR NAME"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-60">Expires</p>
                      <p className="mt-0.5 font-medium tabular">
                        {expiry || "MM/YY"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="h-11 font-mono tracking-wider"
                  placeholder="4242 4242 4242 4242"
                />
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Use 4242… — any future expiry and CVC work in this demo.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  autoComplete="cc-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input
                    id="card-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="h-11 font-mono"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="h-11 font-mono"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-5 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--surface-sunken)]">
                <ShieldCheck className="size-7 text-[var(--primary)]" />
              </div>
              <p className="font-medium">
                {wallet === "apple" ? "Apple Pay" : "Google Pay"}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Mock one-tap wallet — no real wallet prompt. Tap pay to
                simulate approval.
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] px-3 py-2.5 text-xs text-[var(--muted-foreground)]">
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        <span>
          This is a prototype payment gateway. No real card networks are
          contacted and nothing is charged.
        </span>
      </div>

      <ScreenDock className="inset-x-0 bottom-0 z-30">
        <div className="border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pb-6 pt-3 backdrop-blur-md">
          <Button
            size="lg"
            className="h-12 w-full text-base active:scale-[0.98]"
            disabled={phase !== "form"}
            onClick={onPay}
          >
            {isDoor
              ? `Place order · ${formatCurrency(totals.total)}`
              : wallet === "card"
                ? `Pay ${formatCurrency(totals.total)}`
                : `Pay with ${wallet === "apple" ? "Apple Pay" : "Google Pay"}`}
          </Button>
        </div>
      </ScreenDock>

      <AnimatePresence>
        {phase === "processing" || phase === "success" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[var(--background)]/92 px-6 backdrop-blur-sm"
          >
            {phase === "processing" ? (
              <>
                <motion.div
                  className="size-14 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)]"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                />
                <p className="mt-5 font-display text-xl font-semibold">
                  {isDoor ? "Placing your order…" : "Processing payment…"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Talking to the mock gateway
                </p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex size-16 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"
                >
                  <ShieldCheck className="size-8" />
                </motion.div>
                <p className="mt-5 font-display text-xl font-semibold">
                  {isDoor ? "Order confirmed" : "Payment approved"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Preparing your receipt…
                </p>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function WalletChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-[var(--radius-md)] text-xs font-semibold active:scale-[0.98]",
        active
          ? "bg-[var(--primary)] text-white"
          : "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-card)]",
      )}
    >
      {label}
    </button>
  );
}

function OrderSummaryCompact() {
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const totals = calcCartTotals(lines, promoCode);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <div className="space-y-1.5 border-t border-[var(--border)] pt-3 text-sm">
      <div className="flex justify-between">
        <span className="text-[var(--muted-foreground)]">{count} items</span>
        <span className="tabular">{formatCurrency(totals.subtotal)}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span>Total due at door</span>
        <span className="tabular">{formatCurrency(totals.total)}</span>
      </div>
    </div>
  );
}
