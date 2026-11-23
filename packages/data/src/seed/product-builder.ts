import type { PriceTier, Product, ProductStatus } from "../types";
import { daysAgo, upcFromSku } from "./helpers";

export interface ProductSeed {
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  unitSize: string;
  casePack: string;
  unitsPerCase: number;
  b2cPrice: number;
  compareAtPrice?: number;
  b2bCasePrice: number;
  cost: number;
  reorderPoint: number;
  tags: string[];
  description: string;
  status?: ProductStatus;
  visibleOnB2B?: boolean;
  visibleOnMobile?: boolean;
  imageHint: string;
}

function makeTiers(base: number): PriceTier[] {
  return [
    { minCases: 1, maxCases: 9, pricePerCase: roundMoney(base) },
    { minCases: 10, maxCases: 49, pricePerCase: roundMoney(base * 0.96) },
    { minCases: 50, maxCases: null, pricePerCase: roundMoney(base * 0.92) },
  ];
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function buildProduct(seed: ProductSeed, index: number): Product {
  const createdAt = daysAgo(120 - (index % 90), 9);
  return {
    id: `prod-${seed.sku.toLowerCase()}`,
    sku: seed.sku,
    upc: upcFromSku(seed.sku),
    name: seed.name,
    brand: seed.brand,
    categoryId: seed.categoryId,
    unitSize: seed.unitSize,
    casePack: seed.casePack,
    unitsPerCase: seed.unitsPerCase,
    b2cPrice: seed.b2cPrice,
    compareAtPrice: seed.compareAtPrice,
    b2bCasePrice: seed.b2bCasePrice,
    tiers: makeTiers(seed.b2bCasePrice),
    cost: seed.cost,
    reorderPoint: seed.reorderPoint,
    tags: seed.tags,
    description: seed.description,
    status: seed.status ?? "active",
    visibleOnB2B: seed.visibleOnB2B ?? true,
    visibleOnMobile: seed.visibleOnMobile ?? true,
    imageHint: seed.imageHint,
    createdAt,
    updatedAt: daysAgo(index % 14, 14),
  };
}
