import { HST_RATE } from "@calgarywholesale/data";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  PROMO_CODE,
  PROMO_PCT,
} from "./constants";

export interface CartLineInput {
  unitPrice: number;
  quantity: number;
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function lineTotal(unitPrice: number, quantity: number) {
  return round2(unitPrice * quantity);
}

export function calcCartTotals(
  lines: CartLineInput[],
  promoCode: string | null,
) {
  const subtotal = round2(
    lines.reduce((sum, l) => sum + lineTotal(l.unitPrice, l.quantity), 0),
  );
  const promoApplied =
    promoCode?.toUpperCase() === PROMO_CODE && subtotal > 0;
  const discount = promoApplied ? round2(subtotal * PROMO_PCT) : 0;
  const afterDiscount = round2(subtotal - discount);
  const deliveryFee =
    afterDiscount <= 0
      ? 0
      : afterDiscount >= FREE_DELIVERY_MIN
        ? 0
        : DELIVERY_FEE;
  const taxable = round2(afterDiscount + deliveryFee);
  const tax = round2(taxable * HST_RATE);
  const total = round2(taxable + tax);
  const toFreeDelivery = Math.max(0, round2(FREE_DELIVERY_MIN - afterDiscount));

  return {
    subtotal,
    discount,
    promoApplied,
    deliveryFee,
    tax,
    taxRate: HST_RATE,
    total,
    toFreeDelivery,
    freeDeliveryMin: FREE_DELIVERY_MIN,
  };
}

export function isValidPromo(code: string) {
  return code.trim().toUpperCase() === PROMO_CODE;
}