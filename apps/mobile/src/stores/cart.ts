"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_KEY } from "@/lib/constants";
import { lineTotal } from "@/lib/cart-math";
import { isValidPromo } from "@/lib/cart-math";

export interface CartLine {
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  categoryName?: string;
  imageHint?: string;
  imageSrc?: string;
}

interface CartState {
  lines: CartLine[];
  promoCode: string | null;
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  clear: () => void;
  reset: () => void;
  itemCount: () => number;
  getQty: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promoCode: null,
      addItem: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === item.productId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.productId === item.productId
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...item, quantity: qty }] };
        }),
      setQty: (productId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity } : l,
                ),
        })),
      removeItem: (productId) =>
        set((s) => ({
          lines: s.lines.filter((l) => l.productId !== productId),
        })),
      applyPromo: (code) => {
        if (!isValidPromo(code)) {
          return { ok: false, message: "That code isn’t valid on this order." };
        }
        set({ promoCode: code.trim().toUpperCase() });
        return { ok: true, message: "FRESH10 applied — 10% off." };
      },
      clearPromo: () => set({ promoCode: null }),
      clear: () => set({ lines: [], promoCode: null }),
      reset: () => set({ lines: [], promoCode: null }),
      itemCount: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      getQty: (productId) =>
        get().lines.find((l) => l.productId === productId)?.quantity ?? 0,
    }),
    { name: CART_KEY },
  ),
);

export function cartLineAmount(line: CartLine) {
  return lineTotal(line.unitPrice, line.quantity);
}