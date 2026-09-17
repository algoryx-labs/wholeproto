import { Faker, en, en_CA } from "@faker-js/faker";

/** Shared deterministic faker for all seed modules. */
export const faker = new Faker({ locale: [en_CA, en] });
faker.seed(2026);

export const HST_RATE = 0.13;

export const DEMO_ANCHOR = new Date("2026-09-17T12:00:00.000Z");

export function daysAgo(n: number, hour = 10): string {
  const d = new Date(DEMO_ANCHOR);
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(hour, faker.number.int({ min: 0, max: 59 }), 0, 0);
  return d.toISOString();
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function pickHealth(index: number): "in_stock" | "low_stock" | "out_of_stock" {
  const mod = index % 10;
  if (mod === 0) return "out_of_stock";
  if (mod <= 2) return "low_stock";
  return "in_stock";
}

export function upcFromSku(sku: string): string {
  const digits = sku.replace(/\D/g, "").padStart(11, "0").slice(0, 11);
  return `0${digits}`;
}
