import type { Invoice, InvoiceStatus } from "../types";
import { daysAgo, round2 } from "./helpers";
import { orders } from "./orders";
import type { B2BOrder } from "../types";

function invoiceStatus(
  paymentStatus: B2BOrder["paymentStatus"],
  daysSinceDue: number,
): InvoiceStatus {
  if (paymentStatus === "paid") return "paid";
  if (paymentStatus === "partially_paid") return "partially_paid";
  if (daysSinceDue > 0 && paymentStatus === "unpaid") return "overdue";
  return "unpaid";
}

function buildInvoices(): Invoice[] {
  const invoices: Invoice[] = [];
  let seq = 8001;

  for (const order of orders) {
    if (order.channel !== "b2b") continue;
    if (order.status !== "shipped" && order.status !== "delivered") continue;

    const issuedAt = order.updatedAt;
    const due = new Date(issuedAt);
    due.setUTCDate(due.getUTCDate() + 30);
    const dueAt = due.toISOString();
    const daysSinceDue = Math.floor(
      (Date.parse("2026-09-17T12:00:00.000Z") - due.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const status = invoiceStatus(order.paymentStatus, daysSinceDue);
    const amountPaid =
      status === "paid"
        ? order.total
        : status === "partially_paid"
          ? round2(order.total * 0.5)
          : 0;

    invoices.push({
      id: `inv-${seq}`,
      number: `INV-${seq}`,
      orderId: order.id,
      orderNumber: order.number,
      customerId: order.customerId,
      customerName: order.customerName,
      status,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      total: order.total,
      amountPaid,
      balanceDue: round2(order.total - amountPaid),
      issuedAt,
      dueAt,
      paidAt: status === "paid" ? daysAgo(2, 15) : undefined,
      quickbooksSyncedAt: order.quickbooksSyncedAt,
    });
    seq += 1;
  }

  return invoices;
}

export const invoices: Invoice[] = buildInvoices();

export const invoiceById = Object.fromEntries(
  invoices.map((i) => [i.id, i]),
) as Record<string, Invoice>;
