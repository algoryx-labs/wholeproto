import {
  HST_RATE,
  lakeshoreCustomer,
  products,
  warehouses,
  type B2BOrder,
  type OrderLine,
  type Warehouse,
} from "@westwinds/data";

export const PICKUP_WINDOWS = [
  "7:00–9:00 am",
  "9:00–11:00 am",
  "11:00 am–1:00 pm",
  "1:00–3:00 pm",
  "3:00–5:00 pm",
] as const;

export const PICKUP_WAREHOUSES: Warehouse[] = warehouses;

export function warehouseFor(id: string): Warehouse {
  return warehouses.find((w) => w.id === id) ?? warehouses[0]!;
}

export function mapsUrl(w: Warehouse): string {
  const q = `${w.address.line1}, ${w.address.city} ${w.address.province} ${w.address.postalCode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function newPickupCode(): string {
  return `PU-${Math.floor(1000 + Math.random() * 9000)}`;
}

export type PickupState =
  | "awaiting_approval"
  | "scheduled"
  | "ready"
  | "picked_up"
  | "cancelled";

export function pickupState(order: B2BOrder): PickupState {
  switch (order.status) {
    case "pending_approval":
      return "awaiting_approval";
    case "packed":
      return "ready";
    case "shipped":
    case "delivered":
      return "picked_up";
    case "cancelled":
      return "cancelled";
    default:
      return "scheduled";
  }
}

export function isPickup(order: B2BOrder): boolean {
  return order.fulfillment === "pickup" && !!order.pickup;
}

export function canChangePickup(order: B2BOrder): boolean {
  const s = pickupState(order);
  return s === "awaiting_approval" || s === "scheduled" || s === "ready";
}

function demoLines(seed: number, count: number): OrderLine[] {
  const pool = products.filter((p) => p.visibleOnB2B && p.status === "active");
  return Array.from({ length: count }, (_, i) => {
    const p = pool[(seed + i * 7) % pool.length]!;
    const quantity = 2 + ((seed + i) % 6);
    return {
      id: `demo-pu-${seed}-${i}`,
      productId: p.id,
      sku: p.sku,
      name: p.name,
      quantity,
      unitPrice: p.b2bCasePrice,
      lineTotal: Math.round(quantity * p.b2bCasePrice * 100) / 100,
      uom: "case" as const,
    };
  });
}

function demoPickup(
  seq: number,
  status: B2BOrder["status"],
  warehouseId: string,
  date: string,
  window: string,
  createdAt: string,
  history: B2BOrder["statusHistory"],
): B2BOrder {
  const lines = demoLines(seq, 3 + (seq % 3));
  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const taxAmount = Math.round(subtotal * HST_RATE * 100) / 100;
  const buyer = lakeshoreCustomer.users.find((u) => u.isPrimary)!;
  return {
    id: `ord-b2b-pu-${seq}`,
    number: `WW-B-${seq}`,
    channel: "b2b",
    status,
    customerId: lakeshoreCustomer.id,
    customerName: lakeshoreCustomer.name,
    warehouseId,
    lines,
    subtotal,
    taxRate: HST_RATE,
    taxAmount,
    total: Math.round((subtotal + taxAmount) * 100) / 100,
    paymentStatus: status === "delivered" ? "paid" : "unpaid",
    deliveryAddress: lakeshoreCustomer.locations[0]!,
    fulfillment: "pickup",
    pickup: {
      warehouseId,
      date,
      window,
      code: `PU-${((seq * 37) % 9000) + 1000}`,
      contactName: buyer.name,
      vehicle: "White Ford Transit · CBRT 418",
    },
    createdAt,
    updatedAt: history[history.length - 1]!.at,
    statusHistory: history,
  };
}

/** Sample pickup bookings so the Pickups page has content in the demo. */
export const demoPickupOrders: B2BOrder[] = [
  demoPickup(
    10961,
    "packed",
    "wh-brw",
    "2026-09-18",
    PICKUP_WINDOWS[1],
    "2026-09-15T14:20:00.000Z",
    [
      { status: "confirmed", at: "2026-09-15T14:20:00.000Z", by: "Westwinds Ops" },
      { status: "picking", at: "2026-09-16T09:05:00.000Z", by: "Brampton Warehouse" },
      { status: "packed", at: "2026-09-16T15:40:00.000Z", by: "Brampton Warehouse" },
    ],
  ),
  demoPickup(
    10968,
    "confirmed",
    "wh-mdc",
    "2026-09-22",
    PICKUP_WINDOWS[0],
    "2026-09-16T18:10:00.000Z",
    [{ status: "confirmed", at: "2026-09-16T18:10:00.000Z", by: "Westwinds Ops" }],
  ),
  demoPickup(
    10934,
    "delivered",
    "wh-mdc",
    "2026-09-09",
    PICKUP_WINDOWS[2],
    "2026-09-06T13:00:00.000Z",
    [
      { status: "confirmed", at: "2026-09-06T13:00:00.000Z", by: "Westwinds Ops" },
      { status: "packed", at: "2026-09-08T16:30:00.000Z", by: "Mississauga Distribution Centre" },
      { status: "picked_up", at: "2026-09-09T11:42:00.000Z", by: "Dock 4 · signed by buyer" },
    ],
  ),
];
