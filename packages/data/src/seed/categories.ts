import type { Category } from "../types";

export const categories: Category[] = [
  {
    id: "cat-produce",
    slug: "produce",
    name: "Produce",
    description: "Fresh fruit and vegetables sourced for Ontario retailers.",
    sortOrder: 1,
  },
  {
    id: "cat-dairy",
    slug: "dairy-eggs",
    name: "Dairy & Eggs",
    description: "Milk, cheese, yogurt, butter, and eggs.",
    sortOrder: 2,
  },
  {
    id: "cat-bakery",
    slug: "bakery",
    name: "Bakery",
    description: "Fresh and par-baked breads, tortillas, and sweet bakery.",
    sortOrder: 3,
  },
  {
    id: "cat-meat",
    slug: "meat-seafood",
    name: "Meat & Seafood",
    description: "Fresh and frozen proteins for retail and foodservice.",
    sortOrder: 4,
  },
  {
    id: "cat-beverages",
    slug: "beverages",
    name: "Beverages",
    description: "Water, soft drinks, juices, and ready-to-drink tea.",
    sortOrder: 5,
  },
  {
    id: "cat-snacks",
    slug: "snacks",
    name: "Snacks",
    description: "Chips, crackers, nuts, and confectionery.",
    sortOrder: 6,
  },
  {
    id: "cat-pantry",
    slug: "pantry",
    name: "Pantry",
    description: "Dry goods, oils, sauces, rice, and canned staples.",
    sortOrder: 7,
  },
  {
    id: "cat-frozen",
    slug: "frozen",
    name: "Frozen",
    description: "Frozen vegetables, meals, ice cream, and dessert.",
    sortOrder: 8,
  },
  {
    id: "cat-household",
    slug: "household",
    name: "Household",
    description: "Cleaning, paper, and kitchen essentials.",
    sortOrder: 9,
  },
  {
    id: "cat-personal",
    slug: "personal-care",
    name: "Personal Care",
    description: "Everyday personal care and hygiene.",
    sortOrder: 10,
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<string, Category>;
