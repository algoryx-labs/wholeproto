import type {
  Address,
  B2BCustomer,
  B2BCustomerStatus,
  B2BUser,
  B2BUserRole,
  PaymentTerms,
} from "../types";
import { daysAgo, faker } from "./helpers";
import { priceGroups } from "./price-groups";

export const LAKESHORE_CUSTOMER_ID = "b2b-lakeshore";

const businessNames = [
  "Lakeshore Fresh Grocers",
  "Maple Crossing Mini Mart",
  "Harbour Street Café",
  "Northgate Foods Co-op",
  "Queen West Provisions",
  "Dixie Road Market",
  "Ancaster Pantry",
  "Roncesvalles Deli",
  "Burlington Basket",
  "Guelph Street Grocer",
  "Oakville Corner Foods",
  "The Junction Pantry",
  "Stoney Creek Market",
  "Liberty Village Market",
  "Kingston Rd Foods",
  "Port Credit Provisions",
  "Westdale Fine Foods",
  "East York Corner Store",
  "Niagara Falls Deli Co",
  "Brantford Fresh Mart",
  "Milton Village Market",
  "Scarborough Spice & Staple",
  "Yorkdale Cafe Supply",
  "Waterfront Greens",
  "Hamilton Hilltop Grocer",
];

const cities = [
  { city: "Toronto", postal: "M5V" },
  { city: "Mississauga", postal: "L5B" },
  { city: "Brampton", postal: "L6Y" },
  { city: "Hamilton", postal: "L8P" },
  { city: "Oakville", postal: "L6H" },
  { city: "Burlington", postal: "L7L" },
  { city: "Etobicoke", postal: "M9B" },
  { city: "Markham", postal: "L3R" },
];

function makeAddress(id: string, label: string, seed: number): Address {
  const place = cities[seed % cities.length]!;
  return {
    id,
    label,
    line1: `${100 + seed * 17} ${faker.location.street()}`,
    city: place.city,
    province: "ON",
    postalCode: `${place.postal} ${1 + (seed % 9)}${String.fromCharCode(65 + (seed % 26))}${seed % 9}`,
    country: "CA",
    isDefault: label === "Primary",
  };
}

function makeUsers(customerId: string, name: string, count: number): B2BUser[] {
  const roles: B2BUserRole[] = ["account_admin", "buyer", "approver"];
  const users: B2BUser[] = [];
  for (let i = 0; i < count; i += 1) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 18);
    users.push({
      id: `${customerId}-user-${i + 1}`,
      customerId,
      name: `${first} ${last}`,
      email:
        i === 0 && customerId === LAKESHORE_CUSTOMER_ID
          ? "buyer@lakeshorefresh.ca"
          : `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.ca`,
      role: roles[i % roles.length]!,
      phone: `+1 416 555 ${String(1000 + i * 17).slice(0, 4)}`,
      isPrimary: i === 0,
      lastLoginAt: daysAgo(i + 1, 10),
    });
  }
  return users;
}

function buildCustomers(): B2BCustomer[] {
  const customers: B2BCustomer[] = [];
  const statuses: B2BCustomerStatus[] = [
    "active",
    "active",
    "active",
    "pending_approval",
    "on_hold",
  ];
  const terms: PaymentTerms[] = ["Net 15", "Net 30"];

  for (let i = 0; i < 25; i += 1) {
    const name = businessNames[i]!;
    const isLakeshore = name === "Lakeshore Fresh Grocers";
    const id = isLakeshore ? LAKESHORE_CUSTOMER_ID : `b2b-${String(i + 1).padStart(3, "0")}`;
    const priceGroup = priceGroups[isLakeshore ? 2 : i % 3]!;
    const locationCount = 1 + (i % 4);
    const locations = Array.from({ length: locationCount }, (_, loc) =>
      makeAddress(
        `${id}-loc-${loc + 1}`,
        loc === 0 ? "Primary" : `Location ${loc + 1}`,
        i * 4 + loc,
      ),
    );

    const creditLimit = isLakeshore
      ? 25000
      : faker.number.int({ min: 5000, max: 40000 });
    const balance = isLakeshore
      ? 6840.25
      : roundMoney(faker.number.float({ min: 0, max: creditLimit * 0.7 }));

    customers.push({
      id,
      accountNumber: `WW-A-${String(10020 + i)}`,
      name,
      tradeName: isLakeshore ? "Lakeshore Fresh" : undefined,
      hstNumber: `8${String(100000000 + i * 137).slice(0, 9)}RT0001`,
      priceGroupId: priceGroup.id,
      creditLimit,
      balance,
      terms: isLakeshore ? "Net 30" : terms[i % 2]!,
      status: isLakeshore ? "active" : statuses[i % statuses.length]!,
      locations,
      users: makeUsers(id, name, 1 + (i % 4)),
      expectedMonthlyVolume: faker.number.int({ min: 4000, max: 45000 }),
      createdAt: daysAgo(200 - i * 5, 11),
      updatedAt: daysAgo(i % 20, 14),
    });
  }

  return customers;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export const b2bCustomers: B2BCustomer[] = buildCustomers();

export const lakeshoreCustomer = b2bCustomers.find(
  (c) => c.id === LAKESHORE_CUSTOMER_ID,
)!;

export const b2bCustomerById = Object.fromEntries(
  b2bCustomers.map((c) => [c.id, c]),
) as Record<string, B2BCustomer>;
