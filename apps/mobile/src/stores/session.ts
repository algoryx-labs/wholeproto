"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, B2COrder, Consumer } from "@calgarywholesale/data";
import { SESSION_KEY } from "@/lib/constants";

export interface SessionState {
  signedIn: boolean;
  consumer: Consumer | null;
  address: Address | null;
  localOrders: B2COrder[];
  setSignedIn: (value: boolean) => void;
  setConsumer: (consumer: Consumer | null) => void;
  setAddress: (address: Address | null) => void;
  addLocalOrder: (order: B2COrder) => void;
  updateLocalOrder: (id: string, patch: Partial<B2COrder>) => void;
  logout: () => void;
  reset: () => void;
}

const initial = {
  signedIn: false,
  consumer: null as Consumer | null,
  address: null as Address | null,
  localOrders: [] as B2COrder[],
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initial,
      setSignedIn: (signedIn) => set({ signedIn }),
      setConsumer: (consumer) => set({ consumer }),
      setAddress: (address) => set({ address }),
      addLocalOrder: (order) =>
        set((s) => ({ localOrders: [order, ...s.localOrders] })),
      updateLocalOrder: (id, patch) =>
        set((s) => ({
          localOrders: s.localOrders.map((o) =>
            o.id === id || o.number === id ? { ...o, ...patch } : o,
          ),
        })),
      logout: () => set({ ...initial }),
      reset: () => set({ ...initial }),
    }),
    { name: SESSION_KEY },
  ),
);