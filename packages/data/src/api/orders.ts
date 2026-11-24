import { mockDelay } from "@calgarywholesale/lib";
import type {
  B2BOrderStatus,
  B2COrderStatus,
  Channel,
  Invoice,
  Order,
  PaymentStatus,
} from "../types";
import { invoices } from "../seed/invoices";
import { orders, orderById, orderByNumber } from "../seed/orders";

export interface OrderFilters {
  channel?: Channel;
  status?: B2BOrderStatus | B2COrderStatus;
  warehouseId?: string;
  customerId?: string;
  consumerId?: string;
  paymentStatus?: PaymentStatus;
  search?: string;
}

export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  await mockDelay();
  let list = [...orders];

  if (filters.channel) {
    list = list.filter((o) => o.channel === filters.channel);
  }
  if (filters.status) {
    list = list.filter((o) => o.status === filters.status);
  }
  if (filters.warehouseId) {
    list = list.filter((o) => o.warehouseId === filters.warehouseId);
  }
  if (filters.customerId) {
    list = list.filter(
      (o) => o.channel === "b2b" && o.customerId === filters.customerId,
    );
  }
  if (filters.consumerId) {
    list = list.filter(
      (o) => o.channel === "b2c" && o.consumerId === filters.consumerId,
    );
  }
  if (filters.paymentStatus) {
    list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((o) => {
      const name =
        o.channel === "b2b" ? o.customerName : o.consumerName;
      return (
        o.number.toLowerCase().includes(q) || name.toLowerCase().includes(q)
      );
    });
  }

  return list.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export async function getOrder(idOrNumber: string): Promise<Order | undefined> {
  await mockDelay();
  return orderById[idOrNumber] ?? orderByNumber[idOrNumber];
}

export async function getInvoices(filters: {
  customerId?: string;
  status?: Invoice["status"];
} = {}): Promise<Invoice[]> {
  await mockDelay();
  let list = [...invoices];
  if (filters.customerId) {
    list = list.filter((i) => i.customerId === filters.customerId);
  }
  if (filters.status) {
    list = list.filter((i) => i.status === filters.status);
  }
  return list.sort(
    (a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt),
  );
}
