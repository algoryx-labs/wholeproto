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
    description: "Tomatoes, onions, and fresh herbs for the Lakeshore kitchen prep.",
    updatedAt: "2026-09-14",
    items: [
      { sku: "CW-PRD-3003", qty: 8 },
      { sku: "CW-PRD-0231", qty: 4 },
      { sku: "CW-PRD-0988", qty: 6 },
      { sku: "CW-DRY-8805", qty: 4 },
    ],
  },
  {
    id: "list-monthly-dry",
    name: "Monthly dry goods",
    description: "Rice, daal, oil, and pantry staples for the monthly restock.",
    updatedAt: "2026-09-01",
    items: [
      { sku: "CW-PTY-0576", qty: 10 },
      { sku: "CW-PTY-8875", qty: 8 },
      { sku: "CW-PTY-7207", qty: 6 },
      { sku: "CW-BEV-5101", qty: 5 },
    ],
  },
];

export function getSavedList(id: string): SavedList | undefined {
  return SAVED_LISTS.find((l) => l.id === id);
}
