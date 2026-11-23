import type { Category } from "../types";

export const categories: Category[] = [
  {
    id: "cat-produce",
    slug: "large-bags",
    name: "Large Bags",
    description:
      "Heavy-duty paper, poly, and garbage bags for kitchens, retail, and ops.",
    sortOrder: 1,
  },
  {
    id: "cat-dairy",
    slug: "pastries-desserts-mixes",
    name: "Pastries, Desserts & Mixes",
    description:
      "Bakery mixes, sweets, and dessert staples for cafés and catering.",
    sortOrder: 2,
  },
  {
    id: "cat-bakery",
    slug: "single-use-cutlery",
    name: "Single-Use Cutlery",
    description:
      "Forks, spoons, knives, and cutlery kits — plastic, PLA, and heavy-duty.",
    sortOrder: 3,
  },
  {
    id: "cat-meat",
    slug: "tableware-dinnerware",
    name: "Tableware & Dinnerware",
    description:
      "Plates, bowls, trays, and serving ware for dine-in and events.",
    sortOrder: 4,
  },
  {
    id: "cat-beverages",
    slug: "beverage-packaging-cups",
    name: "Beverage Packaging & Cups",
    description:
      "Hot and cold cups, lids, sleeves, straws, and drink packaging.",
    sortOrder: 5,
  },
  {
    id: "cat-snacks",
    slug: "food-prep-wraps-films",
    name: "Food Prep Wraps & Films",
    description:
      "Cling film, foil, parchment, and wraps for prep and storage.",
    sortOrder: 6,
  },
  {
    id: "cat-pantry",
    slug: "packaging-operations",
    name: "Packaging & Operations",
    description:
      "Core packaging supplies and back-of-house operational essentials.",
    sortOrder: 7,
  },
  {
    id: "cat-frozen",
    slug: "commercial-napkins",
    name: "Commercial Napkins",
    description:
      "Dinner napkins, dispenser napkins, and paper service for tables.",
    sortOrder: 8,
  },
  {
    id: "cat-household",
    slug: "takeout-catering-boxes",
    name: "Takeout & Catering Boxes",
    description:
      "Clamshells, kraft boxes, aluminium pans, and catering containers.",
    sortOrder: 9,
  },
  {
    id: "cat-personal",
    slug: "workwear-protective-gear",
    name: "Workwear & Protective Gear",
    description:
      "Gloves, aprons, hairnets, and protective gear for kitchen staff.",
    sortOrder: 10,
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<string, Category>;
