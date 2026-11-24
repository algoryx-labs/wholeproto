import type { B2COrder, OrderLine } from "@calgarywholesale/data";
import { HST_RATE } from "@calgarywholesale/data";
import { calcCartTotals, round2 } from "@/lib/cart-math";
import type { CartLine } from "@/stores/cart";
import type { CheckoutDraft } from "@/stores/checkout";

export function isPickupOrder(order: B2COrder) {
  return (
    order.notes?.includes("Fulfillment: pickup") === true ||
    order.deliverySlot?.toLowerCase().startsWith("pickup") === true
  );
}

export function buildLocalOrder({
  lines,
  promoCode,
  draft,
  consumerId,
  consumerName,
  cardLast4,
}: {
  lines: CartLine[];
  promoCode: string | null;
  draft: CheckoutDraft;
  consumerId: string;
  consumerName: string;
  cardLast4?: string;
}): B2COrder {
  const base = calcCartTotals(lines, promoCode);
  const fulfillment = draft.fulfillment ?? "delivery";
  const totals =
    fulfillment === "pickup" && base.deliveryFee > 0
      ? {
          ...base,
          deliveryFee: 0,
          tax: round2((base.subtotal - base.discount) * base.taxRate),
          total: round2(
            base.subtotal -
              base.discount +
              round2((base.subtotal - base.discount) * base.taxRate),
          ),
        }
      : base;
  const now = new Date().toISOString();
  const seq = String(Math.floor(10000 + Math.random() * 89999));
  const number = `CW-C-${seq}`;

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

  const paymentNote =
    draft.payMethod === "door"
      ? fulfillment === "pickup"
        ? "Pay at pickup"
        : "Pay at door"
      : cardLast4 === "Apple"
        ? "Apple Pay"
        : cardLast4 === "GPay"
          ? "Google Pay"
          : cardLast4
            ? `Card ending ${cardLast4}`
            : "Card payment";

  const slotLabel =
    fulfillment === "pickup"
      ? `Pickup · ${draft.warehouseName} · ${draft.dayLabel} · ${draft.slotLabel}`
      : `Delivery · ${draft.dayLabel} · ${draft.slotLabel}`;

  const noteParts = [
    `Fulfillment: ${fulfillment}`,
    `Warehouse: ${draft.warehouseCode} ${draft.warehouseName}`,
    paymentNote,
    draft.deliveryNotes ? `Notes: ${draft.deliveryNotes}` : null,
    draft.contactPhone ? `Phone: ${draft.contactPhone}` : null,
    draft.contactEmail ? `Email: ${draft.contactEmail}` : null,
  ].filter(Boolean);

  return {
    id: `ord-local-${seq}`,
    number,
    channel: "b2c",
    status: "placed",
    consumerId,
    consumerName: draft.contactName || consumerName,
    warehouseId: draft.warehouseId,
    lines: orderLines,
    subtotal: totals.subtotal,
    taxRate: HST_RATE,
    taxAmount: totals.tax,
    total: totals.total,
    paymentStatus: draft.payMethod === "card" ? "paid" : "unpaid",
    deliveryAddress: draft.address!,
    deliverySlot: slotLabel,
    promoCode: totals.promoApplied ? promoCode ?? undefined : undefined,
    discountAmount: totals.discount || undefined,
    notes: noteParts.join(" · "),
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: "placed", at: now }],
  };
}
