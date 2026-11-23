export interface SavedListItem {
  sku: string;
  qty: number;
}

export interface SavedList {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  items: SavedListItem[];
}

export const SAVED_LISTS: SavedList[] = [
  {
    id: "list-weekly-produce",
    name: "Weekly produce",
    description: "Honeycrisp, berries, and leafy greens for the Lakeshore floor set.",
    updatedAt: "2026-09-14",
    items: [
      { sku: "WW-PRD-10231", qty: 8 },
      { sku: "WW-PRD-10236", qty: 4 },
      { sku: "WW-PRD-10232", qty: 6 },
      { sku: "WW-DRY-20101", qty: 4 },
    ],
  },
  {
    id: "list-monthly-dry",
    name: "Monthly dry goods",
    description: "Rice, chips, and pantry staples for the monthly restock.",
    updatedAt: "2026-09-01",
    items: [
      { sku: "WW-PTY-70101", qty: 10 },
      { sku: "WW-SNK-60101", qty: 8 },
      { sku: "WW-PTY-70102", qty: 6 },
      { sku: "WW-BEV-50101", qty: 5 },
    ],
  },
];

export function getSavedList(id: string): SavedList | undefined {
  return SAVED_LISTS.find((l) => l.id === id);
}
