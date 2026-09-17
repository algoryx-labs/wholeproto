"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { brand, formatCurrency } from "@westwinds/lib";
import { Button, Input, ProductImage, QuantityStepper } from "@westwinds/ui";
import { productImageSrc } from "@/lib/product-image";
import { toast } from "sonner";
import { calcCartTotals } from "@/lib/cart-math";
import { FREE_DELIVERY_MIN } from "@/lib/constants";
import { cartLineAmount, useCartStore } from "@/stores/cart";
import { ScreenDock } from "@/components/screen-dock";

export default function CartPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const clearPromo = useCartStore((s) => s.clearPromo);
  const [code, setCode] = React.useState(promoCode ?? "");
  const totals = calcCartTotals(lines, promoCode);

  const onApply = () => {
    const res = applyPromo(code);
    if (res.ok) toast.success(res.message);
    else {
      clearPromo();
      toast.error(res.message);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-[var(--muted-foreground)]">
          Browse fresh groceries and add a few favourites.
        </p>
        <Button asChild className="h-12 active:scale-[0.98]">
          <Link href="/">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const progress = Math.min(
    100,
    (totals.subtotal / FREE_DELIVERY_MIN) * 100,
  );

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
          Cart
        </h1>
      </div>

      <ul className="space-y-3">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex gap-3 rounded-[var(--radius-lg)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]"
          >
            <ProductImage
              src={line.imageSrc ?? productImageSrc(line.sku)}
              category={line.categoryName ?? "Pantry"}
              name={line.name}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/product/${line.sku}`}
                  className="line-clamp-2 text-sm font-medium"
                >
                  {line.name}
                </Link>
                <button
                  type="button"
                  aria-label="Remove"
                  className="flex size-10 shrink-0 items-center justify-center text-[var(--danger)] active:scale-[0.98]"
                  onClick={() => removeItem(line.productId)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold tabular">
                {formatCurrency(cartLineAmount(line))}
              </p>
              <div className="mt-2">
                <QuantityStepper
                  value={line.quantity}
                  onChange={(n) => setQty(line.productId, n)}
                  min={0}
                  max={99}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-medium">Promo code</p>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="FRESH10"
            className="h-11"
          />
          <Button
            variant="soft"
            className="h-11 shrink-0 active:scale-[0.98]"
            onClick={onApply}
          >
            Apply
          </Button>
        </div>
        {totals.promoApplied ? (
          <p className="text-xs text-[var(--success)]">FRESH10 · 10% off applied</p>
        ) : null}
      </div>

      <div className="space-y-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">Delivery</span>
          <span className="font-medium">
            {totals.deliveryFee === 0
              ? "Free"
              : `${formatCurrency(totals.toFreeDelivery)} to free`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-4 text-sm shadow-[var(--shadow-card)]">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        {totals.discount > 0 ? (
          <Row label="Discount" value={`−${formatCurrency(totals.discount)}`} />
        ) : null}
        <Row
          label="Delivery"
          value={
            totals.deliveryFee === 0
              ? "Free"
              : formatCurrency(totals.deliveryFee)
          }
        />
        <Row
          label={`${brand.taxLabel} (${Math.round(totals.taxRate * 100)}%)`}
          value={formatCurrency(totals.tax)}
        />
        <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
          <span>Total</span>
          <span className="tabular">{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <ScreenDock className="inset-x-0 bottom-0 z-30">
        <div className="border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pb-6 pt-3 backdrop-blur-md">
          <Button
            size="lg"
            className="h-12 w-full text-base active:scale-[0.98]"
            onClick={() => router.push("/checkout")}
          >
            Proceed to checkout
          </Button>
        </div>
      </ScreenDock>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--muted-foreground)]">{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}