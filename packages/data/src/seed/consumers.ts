import type { Address, Consumer } from "../types";
import { daysAgo, faker } from "./helpers";
import { products } from "./products";

const gtaCities = [
  { city: "Toronto", postal: "M4K" },
  { city: "Toronto", postal: "M6G" },
  { city: "North York", postal: "M2N" },
  { city: "Scarborough", postal: "M1T" },
  { city: "Etobicoke", postal: "M9A" },
  { city: "Mississauga", postal: "L5G" },
  { city: "Brampton", postal: "L6X" },
  { city: "Markham", postal: "L3P" },
  { city: "Richmond Hill", postal: "L4C" },
  { city: "Hamilton", postal: "L8R" },
  { city: "Hamilton", postal: "L9A" },
  { city: "Burlington", postal: "L7N" },
];

function makeConsumerAddress(consumerId: string, index: number): Address {
  const place = gtaCities[index % gtaCities.length]!;
  return {
    id: `${consumerId}-addr-1`,
    label: "Home",
    line1: `${20 + index * 13} ${faker.location.street()}`,
    line2: index % 5 === 0 ? `Apt ${100 + index}` : undefined,
    city: place.city,
    province: "ON",
    postalCode: `${place.postal} ${1 + (index % 9)}${String.fromCharCode(65 + (index % 26))}${index % 9}`,
    country: "CA",
    isDefault: true,
  };
}

function buildConsumers(): Consumer[] {
  const list: Consumer[] = [];
  for (let i = 0; i < 60; i += 1) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const id = `con-${String(i + 1).padStart(3, "0")}`;
    const favCount = 1 + (i % 5);
    const favouriteProductIds = Array.from({ length: favCount }, (_, f) => {
      const product = products[(i * 3 + f * 11) % products.length]!;
      return product.id;
    });

    list.push({
      id,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@email.ca`,
      phone: `+1 647 555 ${String(2000 + i).slice(0, 4)}`,
      addresses: [makeConsumerAddress(id, i)],
      favouriteProductIds,
      createdAt: daysAgo(150 - i, 12),
      lastOrderAt: i % 7 === 0 ? undefined : daysAgo(i % 45, 18),
    });
  }
  return list;
}

export const consumers: Consumer[] = buildConsumers();

export const consumerById = Object.fromEntries(
  consumers.map((c) => [c.id, c]),
) as Record<string, Consumer>;
