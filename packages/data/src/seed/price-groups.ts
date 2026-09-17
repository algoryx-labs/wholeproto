import type { PriceGroup } from "../types";

export const priceGroups: PriceGroup[] = [
  {
    id: "pg-standard",
    name: "Standard",
    discountPct: 0,
    description: "List case pricing with published volume tiers.",
  },
  {
    id: "pg-silver",
    name: "Silver",
    discountPct: 3,
    description: "3% off list case price for growing accounts.",
  },
  {
    id: "pg-gold",
    name: "Gold",
    discountPct: 6,
    description: "6% off list case price for high-volume partners.",
  },
];

export const priceGroupById = Object.fromEntries(
  priceGroups.map((g) => [g.id, g]),
) as Record<string, PriceGroup>;
