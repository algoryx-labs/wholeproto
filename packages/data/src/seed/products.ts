import type { Product } from "../types";
import { buildProduct } from "./product-builder";
import { productSeedsBakeryMeat } from "./products-bakery-meat";
import { productSeedsBevSnacks } from "./products-bev-snacks";
import { productSeedsHouseholdPersonal } from "./products-household-personal";
import { productSeedsPantryFrozen } from "./products-pantry-frozen";
import { productSeedsProduceDairy } from "./products-produce-dairy";

const seeds = [
  ...productSeedsProduceDairy,
  ...productSeedsBakeryMeat,
  ...productSeedsBevSnacks,
  ...productSeedsPantryFrozen,
  ...productSeedsHouseholdPersonal,
];

export const products: Product[] = seeds.map((seed, index) =>
  buildProduct(seed, index),
);

export const productById = Object.fromEntries(
  products.map((p) => [p.id, p]),
) as Record<string, Product>;

export const productBySku = Object.fromEntries(
  products.map((p) => [p.sku, p]),
) as Record<string, Product>;

export const HONEYCRISP_SKU = "WW-PRD-10231";
export const honeycrispProduct = productBySku[HONEYCRISP_SKU]!;
