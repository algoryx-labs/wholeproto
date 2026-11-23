import { mockDelay } from "@westwinds/lib";
import type { Category, Product, ProductStatus, StockHealth } from "../types";
import { categories } from "../seed/categories";
import { products, productById, productBySku } from "../seed/products";
import { stockLevels } from "../seed/stock";

export interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  channel?: "b2b" | "mobile";
  brand?: string;
  search?: string;
  stockHealth?: StockHealth;
  warehouseId?: string;
}

export async function getCategories(): Promise<Category[]> {
  await mockDelay();
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  await mockDelay();
  let list = [...products];

  if (filters.categoryId) {
    list = list.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.channel === "b2b") {
    list = list.filter((p) => p.visibleOnB2B);
  }
  if (filters.channel === "mobile") {
    list = list.filter((p) => p.visibleOnMobile);
  }
  if (filters.brand) {
    const brand = filters.brand.toLowerCase();
    list = list.filter((p) => p.brand.toLowerCase().includes(brand));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q),
    );
  }
  if (filters.stockHealth) {
    const matchingIds = new Set(
      stockLevels
        .filter((s) => {
          if (filters.warehouseId && s.warehouseId !== filters.warehouseId) {
            return false;
          }
          return s.health === filters.stockHealth;
        })
        .map((s) => s.productId),
    );
    list = list.filter((p) => matchingIds.has(p.id));
  }

  return list;
}

export async function getProduct(
  idOrSku: string,
): Promise<Product | undefined> {
  await mockDelay();
  return productById[idOrSku] ?? productBySku[idOrSku];
}
