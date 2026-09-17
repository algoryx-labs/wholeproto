export type PermissionModule =
  | "dashboard"
  | "orders"
  | "products"
  | "pricing"
  | "inventory"
  | "transfers"
  | "warehouses"
  | "customers"
  | "reports"
  | "integrations"
  | "users"
  | "settings";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve";

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  warehouseScoped: boolean;
  permissions: Permission[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  warehouseId?: string;
  avatarInitials: string;
  active: boolean;
  lastLoginAt?: string;
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  detail?: string;
  createdAt: string;
}

export interface QuickBooksSyncLog {
  id: string;
  entity: "invoice" | "payment" | "customer";
  entityId: string;
  entityLabel: string;
  status: "success" | "warning" | "error";
  message: string;
  syncedAt: string;
}

export interface DailySales {
  date: string;
  b2bRevenue: number;
  b2cRevenue: number;
  b2bOrders: number;
  b2cOrders: number;
  totalRevenue: number;
  totalOrders: number;
}
