"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOrders,
  LAKESHORE_CUSTOMER_ID,
  type B2BOrder,
  type Order,
} from "@calgarywholesale/data";
import { demoPickupOrders } from "@/lib/pickups";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";

export function useLakeshoreOrders() {
  const overlay = useOrdersOverlayStore((s) => s.orders);
  const query = useQuery({
    queryKey: ["orders-b2b", LAKESHORE_CUSTOMER_ID],
    queryFn: () =>
      getOrders({ channel: "b2b", customerId: LAKESHORE_CUSTOMER_ID }),
  });

  const orders = useMemo(() => {
    const seeded = [
      ...(query.data ?? []).filter((o): o is B2BOrder => o.channel === "b2b"),
      ...(query.data ? demoPickupOrders : []),
    ];
    const overlayIds = new Set(overlay.map((o) => o.id));
    const merged: B2BOrder[] = [
      ...overlay,
      ...seeded.filter((o) => !overlayIds.has(o.id)),
    ];
    return merged.sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }, [query.data, overlay]);

  return { orders, isLoading: query.isLoading, seedOrders: query.data as Order[] | undefined };
}
