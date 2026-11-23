import type { DailySales } from "../types";
import { DEMO_ANCHOR, round2 } from "./helpers";

function buildDailySales(): DailySales[] {
  const series: DailySales[] = [];

  for (let day = 89; day >= 0; day -= 1) {
    const date = new Date(DEMO_ANCHOR);
    date.setUTCDate(date.getUTCDate() - day);
    const iso = date.toISOString().slice(0, 10);
    const weekday = date.getUTCDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.72 : 1;
    const trend = 1 + (89 - day) * 0.0018;
    const wave = 1 + 0.08 * Math.sin((89 - day) / 3.2);

    const b2bOrders = Math.max(
      1,
      Math.round((6 + ((89 - day) % 5)) * weekendFactor),
    );
    const b2cOrders = Math.max(
      1,
      Math.round((4 + ((89 - day) % 4)) * (weekday === 5 ? 1.2 : weekendFactor)),
    );

    const b2bRevenue = round2(
      b2bOrders * 820 * trend * wave * weekendFactor,
    );
    const b2cRevenue = round2(
      b2cOrders * 78 * trend * wave * (weekday === 5 ? 1.15 : 1),
    );

    series.push({
      date: iso,
      b2bRevenue,
      b2cRevenue,
      b2bOrders,
      b2cOrders,
      totalRevenue: round2(b2bRevenue + b2cRevenue),
      totalOrders: b2bOrders + b2cOrders,
    });
  }

  return series;
}

export const dailySales: DailySales[] = buildDailySales();
