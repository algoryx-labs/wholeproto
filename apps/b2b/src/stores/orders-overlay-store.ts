"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { B2BOrder } from "@calgarywholesale/data";

interface OrdersOverlayState {
  orders: B2BOrder[];
  addOrder: (order: B2BOrder) => void;
  getOrder: (idOrNumber: string) => B2BOrder | undefined;
  clear: () => void;
}

export const useOrdersOverlayStore = create<OrdersOverlayState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.id !== order.id)],
        })),
      getOrder: (idOrNumber) =>
        get().orders.find(
          (o) => o.id === idOrNumber || o.number === idOrNumber,
        ),
      clear: () => set({ orders: [] }),
    }),
    { name: "cw-b2b:orders" },
  ),
);
