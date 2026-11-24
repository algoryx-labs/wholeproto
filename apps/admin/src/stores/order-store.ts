"use client";

import type { B2BOrderStatus, B2COrderStatus, Channel } from "@calgarywholesale/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type OrderStatus = B2BOrderStatus | B2COrderStatus;

const B2B_FLOW: B2BOrderStatus[] = [
  "pending_approval",
  "confirmed",
  "picking",
  "packed",
  "shipped",
  "delivered",
];

const B2C_FLOW: B2COrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
];

interface OrderState {
  statusOverrides: Record<string, OrderStatus>;
  warehouseOverrides: Record<string, string>;
  historyAppends: Record<
    string,
    Array<{ status: string; at: string; by?: string }>
  >;
  advanceStatus: (id: string, channel: Channel, current: OrderStatus) => void;
  setWarehouse: (id: string, warehouseId: string) => void;
  getStatus: (id: string, fallback: OrderStatus) => OrderStatus;
  getWarehouse: (id: string, fallback: string) => string;
  getExtraHistory: (
    id: string,
  ) => Array<{ status: string; at: string; by?: string }>;
}

export function nextOrderStatus(
  channel: Channel,
  current: OrderStatus,
): OrderStatus | null {
  const flow = channel === "b2b" ? B2B_FLOW : B2C_FLOW;
  const idx = flow.indexOf(current as never);
  if (idx < 0 || idx >= flow.length - 1) return null;
  return flow[idx + 1]!;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      statusOverrides: {},
      warehouseOverrides: {},
      historyAppends: {},
      advanceStatus: (id, channel, current) => {
        const resolved = get().statusOverrides[id] ?? current;
        const next = nextOrderStatus(channel, resolved);
        if (!next) return;
        const entry = {
          status: next,
          at: new Date().toISOString(),
          by: "Calgary Wholesale Ops",
        };
        set((s) => ({
          statusOverrides: { ...s.statusOverrides, [id]: next },
          historyAppends: {
            ...s.historyAppends,
            [id]: [...(s.historyAppends[id] ?? []), entry],
          },
        }));
      },
      setWarehouse: (id, warehouseId) =>
        set((s) => ({
          warehouseOverrides: { ...s.warehouseOverrides, [id]: warehouseId },
        })),
      getStatus: (id, fallback) => get().statusOverrides[id] ?? fallback,
      getWarehouse: (id, fallback) =>
        get().warehouseOverrides[id] ?? fallback,
      getExtraHistory: (id) => get().historyAppends[id] ?? [],
    }),
    { name: "cw-admin:orders" },
  ),
);
