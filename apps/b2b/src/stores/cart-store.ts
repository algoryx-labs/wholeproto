"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface CartState {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  updateQty: (productId: string, qty: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) => {
        const qty = line.qty ?? 1;
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === line.productId,
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId
                  ? {
                      ...l,
                      qty: l.qty + qty,
                      unitPrice: line.unitPrice,
                      name: line.name,
                      sku: line.sku,
                    }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: line.productId,
                sku: line.sku,
                name: line.name,
                qty,
                unitPrice: line.unitPrice,
              },
            ],
          };
        });
      },
      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeLine(productId);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty } : l,
          ),
        }));
      },
      removeLine: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      clear: () => set({ lines: [] }),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal: () =>
        Math.round(
          get().lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0) * 100,
        ) / 100,
    }),
    { name: "cw-b2b:cart" },
  ),
);
