import type { Address } from "./address";
import type { B2BCustomerStatus, B2BUserRole, PaymentTerms } from "./status";

export interface PriceGroup {
  id: string;
  name: "Standard" | "Silver" | "Gold";
  discountPct: number;
  description: string;
}

export interface B2BUser {
  id: string;
  customerId: string;
  name: string;
  email: string;
  role: B2BUserRole;
  phone?: string;
  isPrimary: boolean;
  lastLoginAt?: string;
}

export interface B2BCustomer {
  id: string;
  accountNumber: string;
  name: string;
  tradeName?: string;
  hstNumber: string;
  priceGroupId: string;
  creditLimit: number;
  balance: number;
  terms: PaymentTerms;
  status: B2BCustomerStatus;
  locations: Address[];
  users: B2BUser[];
  expectedMonthlyVolume?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Consumer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  favouriteProductIds: string[];
  createdAt: string;
  lastOrderAt?: string;
}
