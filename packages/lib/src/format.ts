import { brand } from "./brand";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currency,
  }).format(amount);
}

export function formatDate(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(brand.locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatQty(qty: number, unit = "unit"): string {
  const formatted = new Intl.NumberFormat(brand.locale).format(qty);
  return `${formatted} ${qty === 1 ? unit : `${unit}s`}`;
}
