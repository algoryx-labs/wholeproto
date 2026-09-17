import type { ProductStatus } from "../types";
import type { ProductSeed } from "./product-builder";

/** Compact hand-authored product factory to keep seed files readable and short. */
export function p(
  sku: string,
  name: string,
  brand: string,
  categoryId: string,
  unitSize: string,
  casePack: string,
  unitsPerCase: number,
  b2cPrice: number,
  compareAtPrice: number | null,
  b2bCasePrice: number,
  cost: number,
  reorderPoint: number,
  tags: string[],
  description: string,
  imageHint: string,
  extras: {
    status?: ProductStatus;
    visibleOnB2B?: boolean;
    visibleOnMobile?: boolean;
  } = {},
): ProductSeed {
  return {
    sku,
    name,
    brand,
    categoryId,
    unitSize,
    casePack,
    unitsPerCase,
    b2cPrice,
    compareAtPrice: compareAtPrice ?? undefined,
    b2bCasePrice,
    cost,
    reorderPoint,
    tags,
    description,
    imageHint,
    ...extras,
  };
}
