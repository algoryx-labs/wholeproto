import type {
  Address,
  B2BOrder,
  B2BOrderStatus,
  B2COrder,
  B2COrderStatus,
  Order,
  OrderLine,
  PaymentStatus,
} from "../types";
import { b2bCustomers } from "./customers";
import { consumers } from "./consumers";
import {
  buildDemoB2BOrder,
  DEMO_B2B_ORDER_NUMBER,
  lineTotal,
  statusHistory,
  totalsFromLines,
} from "./demo-order";
import { daysAgo, faker, HST_RATE, round2 } from "./helpers";
import { products } from "./products";
import { warehouses } from "./warehouses";

export { DEMO_B2B_ORDER_NUMBER };

const b2bStatuses: B2BOrderStatus[] = [
  "pending_approval",
  "confirmed",
  "picking",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

const b2cStatuses: B2COrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const paymentStatuses: PaymentStatus[] = [
  "paid",
  "unpaid",
  "partially_paid",
  "refunded",
];

function makeB2BLines(seed: number, count: number): OrderLine[] {
  const lines: OrderLine[] = [];
  for (let i = 0; i < count; i += 1) {
    const product = products[(seed + i * 5) % products.length]!;
    if (!product.visibleOnB2B && product.status !== "active") continue;
    const quantity = faker.number.int({ min: 1, max: 12 });
    const unitPrice = product.b2bCasePrice;
    lines.push({
      id: `ol-b2b-${seed}-${i}`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal: lineTotal(quantity, unitPrice),
      uom: "case",
    });
  }
  if (lines.length === 0) {
    const product = products[0]!;
    lines.push({
      id: `ol-b2b-${seed}-0`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: 4,
      unitPrice: product.b2bCasePrice,
      lineTotal: lineTotal(4, product.b2bCasePrice),
      uom: "case",
    });
  }
  return lines;
}

function makeB2CLines(seed: number, count: number): OrderLine[] {
  const lines: OrderLine[] = [];
  for (let i = 0; i < count; i += 1) {
    const product = products[(seed + i * 9) % products.length]!;
    if (!product.visibleOnMobile) continue;
    const quantity = faker.number.int({ min: 1, max: 6 });
    const unitPrice = product.b2cPrice;
    lines.push({
      id: `ol-b2c-${seed}-${i}`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal: lineTotal(quantity, unitPrice),
      uom: "unit",
    });
  }
  if (lines.length === 0) {
    const product = products.find((p) => p.visibleOnMobile) ?? products[0]!;
    lines.push({
      id: `ol-b2c-${seed}-0`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: 2,
      unitPrice: product.b2cPrice,
      lineTotal: lineTotal(2, product.b2cPrice),
      uom: "unit",
    });
  }
  return lines;
}

function buildOrders(): Order[] {
  const list: Order[] = [buildDemoB2BOrder()];
  let b2bSeq = 10400;
  let b2cSeq = 20001;

  for (let i = 0; i < 107; i += 1) {
    b2bSeq += 1;
    if (b2bSeq === 10482) b2bSeq += 1;
    const customer = b2bCustomers[i % b2bCustomers.length]!;
    const lines = makeB2BLines(i + 10, 2 + (i % 5));
    const { subtotal, taxAmount, total } = totalsFromLines(lines);
    const status = b2bStatuses[i % b2bStatuses.length]!;
    const createdAt = daysAgo(i % 90, 8 + (i % 10));
    const delivery: Address =
      customer.locations[i % customer.locations.length] ?? customer.locations[0]!;

    list.push({
      id: `ord-b2b-${b2bSeq}`,
      number: `WW-B-${b2bSeq}`,
      channel: "b2b",
      status,
      customerId: customer.id,
      customerName: customer.name,
      warehouseId: warehouses[i % warehouses.length]!.id,
      lines,
      subtotal,
      taxRate: HST_RATE,
      taxAmount,
      total,
      paymentStatus:
        status === "cancelled"
          ? "refunded"
          : status === "delivered" || status === "shipped"
            ? paymentStatuses[i % 3]!
            : "unpaid",
      poNumber: i % 3 === 0 ? `PO-${2000 + i}` : undefined,
      deliveryAddress: delivery,
      deliveryDate: daysAgo(Math.max(0, (i % 90) - 3), 9).slice(0, 10),
      quickbooksSyncedAt:
        status === "shipped" || status === "delivered"
          ? daysAgo(Math.max(0, (i % 90) - 1), 17)
          : undefined,
      createdAt,
      updatedAt: daysAgo(Math.max(0, (i % 90) - 1), 14),
      statusHistory: statusHistory(
        b2bStatuses.slice(0, b2bStatuses.indexOf(status) + 1),
        createdAt,
      ),
    } satisfies B2BOrder);
  }

  for (let i = 0; i < 72; i += 1) {
    const consumer = consumers[i % consumers.length]!;
    const lines = makeB2CLines(i + 20, 2 + (i % 4));
    const { subtotal, taxAmount, total } = totalsFromLines(lines);
    const status = b2cStatuses[i % b2cStatuses.length]!;
    const createdAt = daysAgo(i % 90, 12 + (i % 8));
    const number = `WW-C-${b2cSeq}`;
    b2cSeq += 1;
    const discount = i % 11 === 0 ? round2(subtotal * 0.1) : undefined;

    list.push({
      id: `ord-b2c-${number.slice(-5)}`,
      number,
      channel: "b2c",
      status,
      consumerId: consumer.id,
      consumerName: consumer.name,
      warehouseId: warehouses[(i + 1) % warehouses.length]!.id,
      lines,
      subtotal,
      taxRate: HST_RATE,
      taxAmount: discount
        ? round2((subtotal - discount) * HST_RATE)
        : taxAmount,
      total: discount
        ? round2(subtotal - discount + (subtotal - discount) * HST_RATE)
        : total,
      paymentStatus:
        status === "cancelled"
          ? "refunded"
          : status === "delivered"
            ? "paid"
            : i % 4 === 0
              ? "unpaid"
              : "paid",
      deliveryAddress: consumer.addresses[0]!,
      deliverySlot: ["9–11am", "12–2pm", "4–7pm", "7–9pm"][i % 4],
      promoCode: discount ? "FRESH10" : undefined,
      discountAmount: discount,
      createdAt,
      updatedAt: daysAgo(Math.max(0, (i % 90) - 1), 19),
      statusHistory: statusHistory(
        b2cStatuses.slice(0, b2cStatuses.indexOf(status) + 1),
        createdAt,
      ),
    } satisfies B2COrder);
  }

  return list;
}

export const orders: Order[] = buildOrders();

export const orderById = Object.fromEntries(
  orders.map((o) => [o.id, o]),
) as Record<string, Order>;

export const orderByNumber = Object.fromEntries(
  orders.map((o) => [o.number, o]),
) as Record<string, Order>;

export const demoB2BOrder = orderByNumber[DEMO_B2B_ORDER_NUMBER]!;
