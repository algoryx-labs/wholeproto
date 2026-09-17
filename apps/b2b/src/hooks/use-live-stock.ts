"use client";

import * as React from "react";
import type { StockLevel } from "@westwinds/data";

export type LiveStockMap = Record<string, number>;

/** Client overlay: nudge a few product available qtys every ~10s and highlight them. */
export function useLiveStock(levels: StockLevel[] | undefined) {
  const [overlay, setOverlay] = React.useState<LiveStockMap>({});
  const [flashed, setFlashed] = React.useState<Set<string>>(new Set());

  const totalsByProduct = React.useMemo(() => {
    const map: LiveStockMap = {};
    for (const level of levels ?? []) {
      map[level.productId] = (map[level.productId] ?? 0) + level.available;
    }
    return map;
  }, [levels]);

  React.useEffect(() => {
    if (!levels?.length) return;
    const productIds = [...new Set(levels.map((l) => l.productId))];

    const tick = () => {
      const picks = [...productIds]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setOverlay((prev) => {
        const next = { ...prev };
        for (const id of picks) {
          const base = totalsByProduct[id] ?? 0;
          const current = next[id] ?? base;
          const delta = Math.random() > 0.5 ? 1 : -1;
          next[id] = Math.max(0, current + delta);
        }
        return next;
      });
      setFlashed(new Set(picks));
      window.setTimeout(() => setFlashed(new Set()), 1200);
    };

    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, [levels, totalsByProduct]);

  const getAvailable = React.useCallback(
    (productId: string) => overlay[productId] ?? totalsByProduct[productId] ?? 0,
    [overlay, totalsByProduct],
  );

  const isFlashed = React.useCallback(
    (productId: string) => flashed.has(productId),
    [flashed],
  );

  return { getAvailable, isFlashed, overlay };
}
