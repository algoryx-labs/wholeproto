import type { B2BOrder, OrderLine } from "../types";
import { b2bCustomers, LAKESHORE_CUSTOMER_ID } from "./customers";
import { daysAgo, HST_RATE, round2 } from "./helpers";
import { products } from "./products";

export const DEMO_B2B_ORDER_NUMBER = "CW-B-10482";

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
    by: idx === 0 ? undefined : "Wholesale Calgary Ops",
  }));
}

export function buildDemoB2BOrder(): B2BOrder {
  const customer = b2bCustomers.find((c) => c.id === LAKESHORE_CUSTOMER_ID)!;
  const tomatoes = products.find((p) => p.sku === "CW-PRD-3003")!;
  const ghee = products.find((p) => p.sku === "CW-DRY-8805")!;
  const atta = products.find((p) => p.sku === "CW-BKY-3227")!;
  const kabab = products.find((p) => p.sku === "CW-MEA-4101")!;

  const draftLines: Omit<OrderLine, "lineTotal">[] = [
    {
      id: "ol-demo-1",
      productId: tomatoes.id,
      sku: tomatoes.sku,
      name: tomatoes.name,
      quantity: 10,
      unitPrice: tomatoes.tiers[1]?.pricePerCase ?? tomatoes.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-2",
      productId: ghee.id,
      sku: ghee.sku,
      name: ghee.name,
      quantity: 8,
      unitPrice: ghee.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-3",
      productId: atta.id,
      sku: atta.sku,
      name: atta.name,
      quantity: 6,
      unitPrice: atta.b2bCasePrice,
      uom: "case",
    },
    {
      id: "ol-demo-4",
      productId: kabab.id,
      sku: kabab.sku,
      name: kabab.name,
      quantity: 5,
      unitPrice: kabab.b2bCasePrice,
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
