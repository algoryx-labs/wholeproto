import { mockDelay } from "@westwinds/lib";
import type { StockLevel, Transfer } from "../types";
import {
  getStockMatrixRows,
  stockLevels,
} from "../seed/stock";
import {
  transfers,
  transferById,
  transferByNumber,
} from "../seed/transfers";

export interface StockFilters {
  warehouseId?: string;
  productId?: string;
  health?: StockLevel["health"];
  lowOnly?: boolean;
}

export async function getStockLevels(
  filters: StockFilters = {},
): Promise<StockLevel[]> {
  await mockDelay();
  let list = [...stockLevels];
  if (filters.warehouseId) {
    list = list.filter((s) => s.warehouseId === filters.warehouseId);
  }
  if (filters.productId) {
    list = list.filter((s) => s.productId === filters.productId);
  }
  if (filters.health) {
    list = list.filter((s) => s.health === filters.health);
  }
  if (filters.lowOnly) {
    list = list.filter(
      (s) => s.health === "low_stock" || s.health === "out_of_stock",
    );
  }
  return list;
}

export async function getStockMatrix(filters: {
  categoryId?: string;
  search?: string;
  warehouseId?: string;
} = {}) {
  await mockDelay();
  let rows = getStockMatrixRows();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q),
    );
  }
  if (filters.warehouseId) {
    rows = rows.map((r) => ({
      ...r,
      byWarehouse: {
        [filters.warehouseId!]: r.byWarehouse[filters.warehouseId!]!,
      },
    }));
  }
  return rows;
}

export async function getLowStockAlerts(warehouseId?: string): Promise<
  Array<StockLevel & { sku?: string }>
> {
  await mockDelay();
  return stockLevels.filter((s) => {
    if (s.health !== "low_stock" && s.health !== "out_of_stock") return false;
    if (warehouseId && s.warehouseId !== warehouseId) return false;
    return true;
  });
}

export async function getTransfers(filters: {
  status?: Transfer["status"];
  warehouseId?: string;
} = {}): Promise<Transfer[]> {
  await mockDelay();
  let list = [...transfers];
  if (filters.status) {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters.warehouseId) {
    list = list.filter(
      (t) =>
        t.fromWarehouseId === filters.warehouseId ||
        t.toWarehouseId === filters.warehouseId,
    );
  }
  return list.sort(
    (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  );
}

export async function getTransfer(
  idOrNumber: string,
): Promise<Transfer | undefined> {
  await mockDelay();
  return transferById[idOrNumber] ?? transferByNumber[idOrNumber];
}
