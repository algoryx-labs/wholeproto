import type { PriceGroup, PriceTier, Product } from "@westwinds/data";
import { brand } from "@westwinds/lib";

export function applyGroupDiscount(
  listPrice: number,
  group?: PriceGroup | null,
): number {
  const pct = group?.discountPct ?? 0;
  return Math.round(listPrice * (1 - pct / 100) * 100) / 100;
}

export function casePriceForProduct(
  product: Product,
  group?: PriceGroup | null,
  cases = 1,
): number {
  const tier = pickTier(product.tiers, cases);
  const list = tier?.pricePerCase ?? product.b2bCasePrice;
  return applyGroupDiscount(list, group);
}

export function pickTier(
  tiers: PriceTier[],
  cases: number,
): PriceTier | undefined {
  if (!tiers.length) return undefined;
  const sorted = [...tiers].sort((a, b) => a.minCases - b.minCases);
  let match = sorted[0];
  for (const tier of sorted) {
    if (cases >= tier.minCases) match = tier;
  }
  return match;
}

export function tierSavingsNote(
  product: Product,
  qty: number,
  group?: PriceGroup | null,
): string | null {
  if (product.tiers.length < 2 || qty < 1) return null;
  const base = applyGroupDiscount(product.b2bCasePrice, group);
  const current = casePriceForProduct(product, group, qty);
  if (current >= base) return null;
  const saved = Math.round((base - current) * qty * 100) / 100;
  return `Volume tier saves ${formatCad(saved)} on this line`;
}

export function orderTotals(subtotal: number) {
  const taxAmount = Math.round(subtotal * brand.taxRate * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxRate: brand.taxRate, taxAmount, total };
}

function formatCad(n: number) {
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currency,
  }).format(n);
}
