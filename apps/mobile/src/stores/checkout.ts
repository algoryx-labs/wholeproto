"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@westwinds/data";
import { CHECKOUT_KEY } from "@/lib/constants";

export type PayMethod = "card" | "door";
export type FulfillmentMode = "delivery" | "pickup";
export type CheckoutStep = "address" | "warehouse" | "timing";

export interface CheckoutDraft {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  deliveryNotes: string;
  dayId: string;
  dayLabel: string;
  slotId: string;
  slotLabel: string;
  address: Address | null;
  payMethod: PayMethod;
  fulfillment: FulfillmentMode;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
}

interface CheckoutState {
  step: CheckoutStep;
  draft: CheckoutDraft | null;
  setStep: (step: CheckoutStep) => void;
  setDraft: (draft: CheckoutDraft) => void;
  patchDraft: (patch: Partial<CheckoutDraft>) => void;
  clearDraft: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: "address",
      draft: null,
      setStep: (step) => set({ step }),
      setDraft: (draft) => set({ draft }),
      patchDraft: (patch) =>
        set((s) => ({
          draft: s.draft ? { ...s.draft, ...patch } : null,
        })),
      clearDraft: () => set({ draft: null, step: "address" }),
    }),
    { name: CHECKOUT_KEY },
  ),
);
