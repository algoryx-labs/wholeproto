import type { B2BOrder, OrderLine } from "../types";
import { b2bCustomers, LAKESHORE_CUSTOMER_ID } from "./customers";
import { daysAgo, HST_RATE, round2 } from "./helpers";
import { products } from "./products";

export const DEMO_B2B_ORDER_NUMBER = "WW-B-10482";

export function lineTotal(qty: number, unitPrice: number): number {
  return round2(qty * unitPrice);
}

export function totalsFromLines(lines: OrderLine[]): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  const taxAmount = round2(subtotal * HST_RATE);
  return { subtotal, taxAmount, total: round2(subtotal + taxAmount) };
}

export function statusHistory(
  statuses: string[],
  createdAt: string,
): Array<{ status: string; at: string; by?: string }> {
  return statuses.map((status, idx) => ({
    status,
    at: new Date(
      new Date(createdAt).getTime() + idx * 1000 * 60 * 60 * 8,
    ).toISOString(),
    by: idx === 0 ? undefined : "Warehouse Ops",
  }));
}

export function buildDemoB2BOrder(): B2BOrder {
  const customer = b2bCustomers.find((c) => c.id === LAKESHORE_CUSTOMER_ID)!;
  const honeycrisp = products.find((p) => p.sku === "WW-PRD-10231")!;
  const milk = products.find((p) => p.sku === "WW-DRY-20101")!;
  const rice = products.find((p) => p.sku === "WW-PTY-70101")!;
  const chips = products.find((p) => p.sku === "WW-SNK-60101")!;

  const draftLines: Omit<OrderLine, "lineTotal">[] = [
    {
      id: "ol-demo-1",
      productId: honeycrisp.id,
      sku: honeycrisp.sku,
      name: honeycrisp.name,
      quantity: 10,
      unitPrice: honeycrisp.tiers[1]?.pricePerCase ?? honeycrisp.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-2",
      productId: milk.id,
      sku: milk.sku,
      name: milk.name,
      quantity: 8,
      unitPrice: milk.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-3",
      productId: rice.id,
      sku: rice.sku,
      name: rice.name,
      quantity: 6,
      unitPrice: rice.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-4",
      productId: chips.id,
      sku: chips.sku,
      name: chips.name,
      quantity: 5,
      unitPrice: chips.b2bCasePrice,
      uom: "case",
    },
  ];

  const lines: OrderLine[] = draftLines.map((l) => ({
    ...l,
    lineTotal: lineTotal(l.quantity, l.unitPrice),
  }));
  const { subtotal, taxAmount, total } = totalsFromLines(lines);
  const createdAt = daysAgo(3, 11);

  return {
    id: "ord-b2b-10482",
    number: DEMO_B2B_ORDER_NUMBER,
    channel: "b2b",
    status: "confirmed",
    customerId: customer.id,
    customerName: customer.name,
    warehouseId: "wh-mdc",
    lines,
    subtotal,
    taxRate: HST_RATE,
    taxAmount,
    total,
    paymentStatus: "unpaid",
    poNumber: "PO-LF-4481",
    deliveryAddress: customer.locations[0]!,
    deliveryDate: daysAgo(-2, 9).slice(0, 10),
    notes: "Dock delivery before 11:00 — Lakeshore weekly restock",
    createdAt,
    updatedAt: daysAgo(2, 16),
    statusHistory: statusHistory(["pending_approval", "confirmed"], createdAt),
  };
}
