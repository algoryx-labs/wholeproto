export type B2BOrderStatus =
  | "pending_approval"
  | "confirmed"
  | "picking"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type B2COrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type TransferStatus =
  | "draft"
  | "requested"
  | "in_transit"
  | "partially_received"
  | "received"
  | "cancelled";

export type InvoiceStatus = "paid" | "unpaid" | "partially_paid" | "overdue";

export type StockHealth = "in_stock" | "low_stock" | "out_of_stock";

export type StockMovementType =
  | "received"
  | "sold_b2b"
  | "sold_b2c"
  | "transfer_out"
  | "transfer_in"
  | "adjustment_damaged"
  | "adjustment_expired"
  | "adjustment_count"
  | "return";

export type ProductStatus = "draft" | "active" | "archived";

export type PaymentStatus = "paid" | "unpaid" | "partially_paid" | "refunded";

export type B2BCustomerStatus = "active" | "pending_approval" | "on_hold";

export type B2BUserRole = "account_admin" | "buyer" | "approver";

export type PaymentTerms = "Net 15" | "Net 30";

export type QuickBooksEntity = "invoice" | "payment" | "customer";

export type QuickBooksSyncStatus = "success" | "warning" | "error";

export type PromotionType =
  | "percent_off"
  | "fixed_off"
  | "buy_x_get_y"
  | "b2b_volume";

export type Channel = "b2b" | "b2c";
