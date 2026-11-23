import { mockDelay } from "@westwinds/lib";
import type { B2BCustomer, B2BCustomerStatus, Consumer, PriceGroup } from "../types";
import {
  b2bCustomers,
  b2bCustomerById,
} from "../seed/customers";
import { consumers, consumerById } from "../seed/consumers";
import { priceGroups } from "../seed/price-groups";

export async function getPriceGroups(): Promise<PriceGroup[]> {
  await mockDelay();
  return priceGroups;
}

export async function getB2BCustomers(filters: {
  status?: B2BCustomerStatus;
  priceGroupId?: string;
  search?: string;
} = {}): Promise<B2BCustomer[]> {
  await mockDelay();
  let list = [...b2bCustomers];
  if (filters.status) {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters.priceGroupId) {
    list = list.filter((c) => c.priceGroupId === filters.priceGroupId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getB2BCustomer(
  id: string,
): Promise<B2BCustomer | undefined> {
  await mockDelay();
  return b2bCustomerById[id];
}

export async function getConsumers(filters: {
  search?: string;
} = {}): Promise<Consumer[]> {
  await mockDelay();
  let list = [...consumers];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getConsumer(id: string): Promise<Consumer | undefined> {
  await mockDelay();
  return consumerById[id];
}
