"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductOverlay {
  name?: string;
  b2cPrice?: number;
  b2bCasePrice?: number;
  visibleOnB2B?: boolean;
  visibleOnMobile?: boolean;
  status?: "draft" | "active" | "archived";
}

/** Stable empty overlay — never allocate `{}` inside Zustand selectors. */
export const EMPTY_PRODUCT_OVERLAY: ProductOverlay = Object.freeze({});

interface ProductState {
  overlays: Record<string, ProductOverlay>;
  updateProduct: (id: string, patch: ProductOverlay) => void;
  getOverlay: (id: string) => ProductOverlay;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      overlays: {},
      updateProduct: (id, patch) =>
        set((s) => ({
          overlays: {
            ...s.overlays,
            [id]: { ...s.overlays[id], ...patch },
          },
        })),
      getOverlay: (id) => get().overlays[id] ?? EMPTY_PRODUCT_OVERLAY,
    }),
    { name: "cw-admin:products" },
  ),
);
