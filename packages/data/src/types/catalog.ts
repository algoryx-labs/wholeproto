import type { ProductStatus } from "./status";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  parentId?: string;
}

export interface PriceTier {
  minCases: number;
  maxCases: number | null;
  pricePerCase: number;
}

export interface Product {
  id: string;
  sku: string;
  upc: string;
  name: string;
  brand: string;
  categoryId: string;
  unitSize: string;
  casePack: string;
  unitsPerCase: number;
  b2cPrice: number;
  compareAtPrice?: number;
  b2bCasePrice: number;
  tiers: PriceTier[];
  cost: number;
  reorderPoint: number;
  tags: string[];
  description: string;
  status: ProductStatus;
  visibleOnB2B: boolean;
  visibleOnMobile: boolean;
  imageHint: string;
  createdAt: string;
  updatedAt: string;
}
