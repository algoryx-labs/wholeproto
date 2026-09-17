"use client";

import type { Transfer, TransferLine } from "@westwinds/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StockCell = {
  onHand: number;
  available: number;
  allocated: number;
  health: "in_stock" | "low_stock" | "out_of_stock";
  binLocation: string;
};

function stockKey(productId: string, warehouseId: string) {
  return `${productId}:${warehouseId}`;
}

function healthFromQty(available: number, reorderPoint: number) {
  if (available <= 0) return "out_of_stock" as const;
  if (available <= reorderPoint) return "low_stock" as const;
  return "in_stock" as const;
}

interface InventoryState {
  /** Absolute cell overrides keyed by productId:warehouseId */
  stockOverrides: Record<string, StockCell>;
  localTransfers: Transfer[];
  transferOverrides: Record<string, Partial<Transfer>>;
  receivedTransferIds: string[];
  applyStockDelta: (args: {
    productId: string;
    warehouseId: string;
    delta: number;
    reorderPoint: number;
    base?: StockCell;
  }) => void;
  setStockOverride: (key: string, cell: StockCell) => void;
  createTransfer: (transfer: Transfer) => void;
  updateTransfer: (id: string, patch: Partial<Transfer>) => void;
  receiveTransfer: (args: {
    transfer: Transfer;
    reorderByProduct: Record<string, number>;
    baseCells: Record<string, StockCell>;
  }) => void;
  resetDemo: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      stockOverrides: {},
      localTransfers: [],
      transferOverrides: {},
      receivedTransferIds: [],
      applyStockDelta: ({
        productId,
        warehouseId,
        delta,
        reorderPoint,
        base,
      }) => {
        const key = stockKey(productId, warehouseId);
        const current = get().stockOverrides[key] ?? base;
        if (!current) return;
        const onHand = Math.max(0, current.onHand + delta);
        const available = Math.max(0, current.available + delta);
        set((s) => ({
          stockOverrides: {
            ...s.stockOverrides,
            [key]: {
              ...current,
              onHand,
              available,
              health: healthFromQty(available, reorderPoint),
            },
          },
        }));
      },
      setStockOverride: (key, cell) =>
        set((s) => ({
          stockOverrides: { ...s.stockOverrides, [key]: cell },
        })),
      createTransfer: (transfer) =>
        set((s) => ({
          localTransfers: [transfer, ...s.localTransfers],
        })),
      updateTransfer: (id, patch) =>
        set((s) => ({
          transferOverrides: {
            ...s.transferOverrides,
            [id]: { ...s.transferOverrides[id], ...patch },
          },
        })),
      receiveTransfer: ({ transfer, reorderByProduct, baseCells }) => {
        if (get().receivedTransferIds.includes(transfer.id)) return;
        const overrides = { ...get().stockOverrides };
        for (const line of transfer.lines) {
          const qty = line.shippedQty || line.requestedQty;
          const fromKey = stockKey(line.productId, transfer.fromWarehouseId);
          const toKey = stockKey(line.productId, transfer.toWarehouseId);
          const reorder = reorderByProduct[line.productId] ?? 10;

          const fromBase = overrides[fromKey] ?? baseCells[fromKey];
          const toBase = overrides[toKey] ?? baseCells[toKey];
          if (fromBase) {
            const onHand = Math.max(0, fromBase.onHand - qty);
            const available = Math.max(0, fromBase.available - qty);
            overrides[fromKey] = {
              ...fromBase,
              onHand,
              available,
              health: healthFromQty(available, reorder),
            };
          }
          if (toBase) {
            const onHand = toBase.onHand + qty;
            const available = toBase.available + qty;
            overrides[toKey] = {
              ...toBase,
              onHand,
              available,
              health: healthFromQty(available, reorder),
            };
          } else {
            overrides[toKey] = {
              onHand: qty,
              available: qty,
              allocated: 0,
              health: healthFromQty(qty, reorder),
              binLocation: "RECV",
            };
          }
        }
        const now = new Date().toISOString();
        const receivedLines: TransferLine[] = transfer.lines.map((l) => ({
          ...l,
          receivedQty: l.shippedQty || l.requestedQty,
          shippedQty: l.shippedQty || l.requestedQty,
        }));
        set((s) => ({
          stockOverrides: overrides,
          receivedTransferIds: [...s.receivedTransferIds, transfer.id],
          transferOverrides: {
            ...s.transferOverrides,
            [transfer.id]: {
              ...s.transferOverrides[transfer.id],
              status: "received",
              lines: receivedLines,
              receivedAt: now,
              updatedAt: now,
            },
          },
        }));
      },
      resetDemo: () =>
        set({
          stockOverrides: {},
          localTransfers: [],
          transferOverrides: {},
          receivedTransferIds: [],
        }),
    }),
    { name: "ww-admin:inventory" },
  ),
);

export { stockKey };
