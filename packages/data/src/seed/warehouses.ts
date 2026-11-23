import type { Warehouse } from "../types";

export const warehouses: Warehouse[] = [
  {
    id: "wh-mdc",
    code: "MDC",
    name: "Mississauga Distribution Centre",
    address: {
      line1: "6750 Mississauga Rd",
      city: "Mississauga",
      province: "ON",
      postalCode: "L5N 2L3",
      country: "CA",
    },
    managerName: "Priya Singh",
    managerEmail: "priya.singh@calgarywholesale.ca",
    capacityPct: 78,
    zones: [
      { code: "A", name: "Ambient grocery" },
      { code: "B", name: "Produce" },
      { code: "C", name: "Dairy & chilled" },
      { code: "D", name: "Frozen" },
      { code: "E", name: "Staging / outbound" },
    ],
    phone: "+1 905 555 0101",
  },
  {
    id: "wh-brw",
    code: "BRW",
    name: "Brampton Warehouse",
    address: {
      line1: "220 Steeles Ave W",
      city: "Brampton",
      province: "ON",
      postalCode: "L6Y 0A1",
      country: "CA",
    },
    managerName: "Marcus Chen",
    managerEmail: "marcus.chen@calgarywholesale.ca",
    capacityPct: 64,
    zones: [
      { code: "A", name: "Ambient grocery" },
      { code: "B", name: "Produce" },
      { code: "C", name: "Meat & seafood" },
      { code: "D", name: "Frozen" },
      { code: "E", name: "Returns" },
    ],
    phone: "+1 905 555 0102",
  },
  {
    id: "wh-etx",
    code: "ETX",
    name: "Etobicoke Cross-Dock",
    address: {
      line1: "150 The West Mall",
      city: "Etobicoke",
      province: "ON",
      postalCode: "M9C 1C1",
      country: "CA",
    },
    managerName: "Elena Petrova",
    managerEmail: "elena.petrova@calgarywholesale.ca",
    capacityPct: 52,
    zones: [
      { code: "X1", name: "Cross-dock inbound" },
      { code: "X2", name: "Cross-dock outbound" },
      { code: "C", name: "Short-hold chilled" },
      { code: "S", name: "Same-day staging" },
    ],
    phone: "+1 416 555 0103",
  },
  {
    id: "wh-hmd",
    code: "HMD",
    name: "Hamilton Depot",
    address: {
      line1: "85 Burlington St E",
      city: "Hamilton",
      province: "ON",
      postalCode: "L8L 4G7",
      country: "CA",
    },
    managerName: "James Okonkwo",
    managerEmail: "james.okonkwo@calgarywholesale.ca",
    capacityPct: 71,
    zones: [
      { code: "A", name: "Ambient grocery" },
      { code: "B", name: "Produce" },
      { code: "C", name: "Dairy & chilled" },
      { code: "D", name: "Frozen" },
    ],
    phone: "+1 905 555 0104",
  },
];

export const warehouseByCode = Object.fromEntries(
  warehouses.map((w) => [w.code, w]),
) as Record<Warehouse["code"], Warehouse>;

export const warehouseById = Object.fromEntries(
  warehouses.map((w) => [w.id, w]),
) as Record<string, Warehouse>;
