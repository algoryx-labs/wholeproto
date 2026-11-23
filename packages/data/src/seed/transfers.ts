import type { Transfer, TransferLine, TransferStatus } from "../types";
import { daysAgo, faker } from "./helpers";
import { products } from "./products";
import { warehouses } from "./warehouses";

const statuses: TransferStatus[] = [
  "draft",
  "requested",
  "in_transit",
  "partially_received",
  "received",
  "cancelled",
];

function makeLines(seed: number, count: number): TransferLine[] {
  const lines: TransferLine[] = [];
  for (let i = 0; i < count; i += 1) {
    const product = products[(seed + i * 7) % products.length]!;
    const requestedQty = faker.number.int({ min: 4, max: 40 });
    const shippedQty =
      seed % 6 === 0 ? 0 : faker.number.int({ min: Math.floor(requestedQty * 0.7), max: requestedQty });
    const receivedQty =
      seed % 6 >= 3
        ? faker.number.int({ min: Math.floor(shippedQty * 0.5), max: shippedQty })
        : 0;

    lines.push({
      id: `trl-${seed}-${i}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      requestedQty,
      shippedQty,
      receivedQty,
    });
  }
  return lines;
}

function buildTransfers(): Transfer[] {
  const list: Transfer[] = [];
  const requesters = [
    "Priya Singh",
    "Marcus Chen",
    "Elena Petrova",
    "James Okonkwo",
    "Aisha Rahman",
  ];

  for (let n = 1; n <= 35; n += 1) {
    const from = warehouses[n % warehouses.length]!;
    const to = warehouses[(n + 1) % warehouses.length]!;
    const status = statuses[n % statuses.length]!;
    const createdAt = daysAgo(90 - n * 2, 9);
    const number = `TRF-${String(n).padStart(5, "0")}`;

    // Demo-friendly transfer: BRW → MDC produce replenishment
    const isDemo = n === 12;

    list.push({
      id: `trf-${String(n).padStart(5, "0")}`,
      number,
      fromWarehouseId: isDemo ? "wh-brw" : from.id,
      toWarehouseId: isDemo ? "wh-mdc" : to.id,
      status: isDemo ? "requested" : status,
      lines: makeLines(n, faker.number.int({ min: 2, max: 6 })),
      requestedBy: requesters[n % requesters.length]!,
      notes:
        isDemo
          ? "Replenish Calgary Roma tomatoes and produce shorts"
          : n % 5 === 0
            ? "Weekly balancing transfer"
            : undefined,
      createdAt,
      updatedAt: daysAgo(Math.max(0, 90 - n * 2 - 1), 15),
      shippedAt:
        status === "in_transit" ||
        status === "partially_received" ||
        status === "received"
          ? daysAgo(Math.max(0, 88 - n * 2), 11)
          : undefined,
      receivedAt: status === "received" ? daysAgo(Math.max(0, 86 - n * 2), 16) : undefined,
    });
  }

  return list;
}

export const transfers: Transfer[] = buildTransfers();

export const transferById = Object.fromEntries(
  transfers.map((t) => [t.id, t]),
) as Record<string, Transfer>;

export const transferByNumber = Object.fromEntries(
  transfers.map((t) => [t.number, t]),
) as Record<string, Transfer>;
