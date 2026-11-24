"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaymentMethod = "eft" | "pad" | "card" | "cheque";

export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
}

export interface PortalPayment {
  id: string;
  reference: string;
  method: PaymentMethod;
  amount: number;
  allocations: PaymentAllocation[];
  createdAt: string;
  by?: string;
  memo?: string;
  source: "portal" | "recorded";
}

interface BillingState {
  payments: PortalPayment[];
  addPayment: (payment: PortalPayment) => void;
  clear: () => void;
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      payments: [],
      addPayment: (payment) =>
        set((state) => ({ payments: [payment, ...state.payments] })),
      clear: () => set({ payments: [] }),
    }),
    { name: "cw-b2b:billing" },
  ),
);
