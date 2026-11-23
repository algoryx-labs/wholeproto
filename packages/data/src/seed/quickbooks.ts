import type { QuickBooksSyncLog } from "../types";
import { daysAgo } from "./helpers";
import { invoices } from "./invoices";
import { b2bCustomers } from "./customers";

function buildQuickBooksLogs(): QuickBooksSyncLog[] {
  const logs: QuickBooksSyncLog[] = [];

  for (let i = 0; i < 30; i += 1) {
    const kind = i % 3;
    if (kind === 0) {
      const invoice = invoices[i % Math.max(1, invoices.length)];
      if (!invoice) {
        logs.push({
          id: `qb-${String(i + 1).padStart(3, "0")}`,
          entity: "invoice",
          entityId: "inv-placeholder",
          entityLabel: "INV-pending",
          status: "warning",
          message: "No invoice ready to sync",
          syncedAt: daysAgo(i, 16),
        });
        continue;
      }
      logs.push({
        id: `qb-${String(i + 1).padStart(3, "0")}`,
        entity: "invoice",
        entityId: invoice.id,
        entityLabel: invoice.number,
        status: i % 11 === 0 ? "warning" : "success",
        message:
          i % 11 === 0
            ? "Synced with tax rounding warning"
            : "Invoice pushed to QuickBooks Online",
        syncedAt: daysAgo(i % 40, 16),
      });
    } else if (kind === 1) {
      const invoice = invoices[(i + 3) % Math.max(1, invoices.length)];
      logs.push({
        id: `qb-${String(i + 1).padStart(3, "0")}`,
        entity: "payment",
        entityId: invoice?.id ?? `pay-${i}`,
        entityLabel: invoice ? `PMT-${invoice.number}` : `PMT-${i}`,
        status: i % 13 === 0 ? "error" : "success",
        message:
          i % 13 === 0
            ? "Payment match failed — customer currency mismatch"
            : "Payment applied in QuickBooks",
        syncedAt: daysAgo(i % 35, 17),
      });
    } else {
      const customer = b2bCustomers[i % b2bCustomers.length]!;
      logs.push({
        id: `qb-${String(i + 1).padStart(3, "0")}`,
        entity: "customer",
        entityId: customer.id,
        entityLabel: customer.name,
        status: i % 17 === 0 ? "warning" : "success",
        message:
          i % 17 === 0
            ? "Customer display name already exists in QBO"
            : "Customer record upserted",
        syncedAt: daysAgo(i % 50, 15),
      });
    }
  }

  return logs.sort(
    (a, b) => Date.parse(b.syncedAt) - Date.parse(a.syncedAt),
  );
}

export const quickBooksLogs: QuickBooksSyncLog[] = buildQuickBooksLogs();
