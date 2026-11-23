"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getLowStockAlerts,
  getOrders,
  getProducts,
  getWarehouses,
  productById,
} from "@westwinds/data";
import { useInventoryStore, type StockCell, stockKey } from "@/stores/inventory-store";
import { useSessionStore } from "@/stores/session-store";

export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
}

export function usePendingOrdersCount() {
  return useQuery({
    queryKey: ["orders", "pending-count"],
    queryFn: async () => {
      const orders = await getOrders();
      return orders.filter(
        (o) =>
          o.status === "pending_approval" ||
          o.status === "placed" ||
          o.status === "confirmed" ||
          o.status === "picking",
      ).length;
    },
  });
}

export function useLowStockCount() {
  const scope = useSessionStore((s) => s.warehouseScopeId);
  return useQuery({
    queryKey: ["low-stock-count", scope],
    queryFn: async () => {
      const alerts = await getLowStockAlerts(
        scope === "all" ? undefined : scope,
      );
      const seen = new Set(alerts.map((a) => a.productId));
      return seen.size;
    },
  });
}

export function mergeStockCell(
  productId: string,
  warehouseId: string,
  base: StockCell | undefined,
  overrides: Record<string, StockCell>,
): StockCell | undefined {
  const key = stockKey(productId, warehouseId);
  return overrides[key] ?? base;
}

export function useMergedMatrix() {
  const overrides = useInventoryStore((s) => s.stockOverrides);
  return { overrides, mergeStockCell };
}

export function enrichLowStock(
  alerts: Array<{ productId: string; warehouseId: string; health: string; available: number; onHand: number }>,
) {
  return alerts.map((a) => {
    const product = productById[a.productId];
    return {
      ...a,
      sku: product?.sku,
      name: product?.name,
    };
  });
}
