import type { Address } from "./address";
import type {
  B2BOrderStatus,
  B2COrderStatus,
  Channel,
  InvoiceStatus,
  PaymentStatus,
  PromotionType,
} from "./status";

export interface OrderLine {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Cases for B2B; units for B2C */
  uom: "case" | "unit";
}

interface OrderBase {
  id: string;
  number: string;
  warehouseId: string;
  lines: OrderLine[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: string;
    at: string;
    by?: string;
  }>;
}

export type FulfillmentMethod = "delivery" | "pickup";

export interface PickupDetails {
  warehouseId: string;
  /** yyyy-MM-dd */
  date: string;
  window: string;
  code: string;
  contactName?: string;
  vehicle?: string;
}

export interface B2BOrder extends OrderBase {
  channel: "b2b";
  status: B2BOrderStatus;
  customerId: string;
  customerName: string;
  poNumber?: string;
  deliveryAddress: Address;
  deliveryDate?: string;
  /** Missing on older orders, which are all deliveries */
  fulfillment?: FulfillmentMethod;
  pickup?: PickupDetails;
  quickbooksSyncedAt?: string;
}

export interface B2COrder extends OrderBase {
  channel: "b2c";
  status: B2COrderStatus;
  consumerId: string;
  consumerName: string;
  deliveryAddress: Address;
  deliverySlot?: string;
  promoCode?: string;
  discountAmount?: number;
}

export type Order = B2BOrder | B2COrder;

export interface Invoice {
  id: string;
  number: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  quickbooksSyncedAt?: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromotionType;
  channel: Channel | "both";
  value: number;
  buyQty?: number;
  getQty?: number;
  minCases?: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
  productIds?: string[];
  categoryIds?: string[];
}

export interface Banner {
  id: string;
  headline: string;
  subcopy: string;
  ctaLabel: string;
  ctaHref: string;
  tintColour: string;
  imageHint: string;
  sortOrder: number;
  active: boolean;
}
