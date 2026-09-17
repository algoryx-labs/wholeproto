import type {
  AdminUser,
  Permission,
  PermissionAction,
  PermissionModule,
  Role,
} from "../types";
import { daysAgo } from "./helpers";

const modules: PermissionModule[] = [
  "dashboard",
  "orders",
  "products",
  "pricing",
  "inventory",
  "transfers",
  "warehouses",
  "customers",
  "reports",
  "integrations",
  "users",
  "settings",
];

const allActions: PermissionAction[] = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
];

function perms(
  allowed: Partial<Record<PermissionModule, PermissionAction[]>>,
): Permission[] {
  return modules.map((module) => ({
    module,
    actions: allowed[module] ?? [],
  }));
}

export const roles: Role[] = [
  {
    id: "role-owner",
    name: "Owner",
    description: "Full access across Westwinds Admin.",
    warehouseScoped: false,
    permissions: perms(
      Object.fromEntries(modules.map((m) => [m, allActions])) as Record<
        PermissionModule,
        PermissionAction[]
      >,
    ),
  },
  {
    id: "role-ops",
    name: "Operations manager",
    description: "Orders, inventory, transfers, and warehouses.",
    warehouseScoped: false,
    permissions: perms({
      dashboard: ["view"],
      orders: ["view", "create", "edit", "approve"],
      products: ["view", "edit"],
      pricing: ["view"],
      inventory: ["view", "create", "edit"],
      transfers: ["view", "create", "edit", "approve"],
      warehouses: ["view", "edit"],
      customers: ["view"],
      reports: ["view"],
      integrations: ["view"],
      settings: ["view"],
    }),
  },
  {
    id: "role-warehouse",
    name: "Warehouse staff",
    description: "Scoped to an assigned warehouse for pick/pack and receive.",
    warehouseScoped: true,
    permissions: perms({
      dashboard: ["view"],
      orders: ["view", "edit"],
      products: ["view"],
      inventory: ["view", "edit"],
      transfers: ["view", "edit"],
      warehouses: ["view"],
    }),
  },
  {
    id: "role-sales",
    name: "Sales manager",
    description: "B2B accounts, pricing, promotions, and order approvals.",
    warehouseScoped: false,
    permissions: perms({
      dashboard: ["view"],
      orders: ["view", "create", "edit", "approve"],
      products: ["view"],
      pricing: ["view", "create", "edit"],
      customers: ["view", "create", "edit", "approve"],
      reports: ["view"],
    }),
  },
  {
    id: "role-accountant",
    name: "Accountant",
    description: "Invoices, payments, reports, and QuickBooks sync.",
    warehouseScoped: false,
    permissions: perms({
      dashboard: ["view"],
      orders: ["view"],
      customers: ["view"],
      reports: ["view"],
      integrations: ["view", "edit"],
      settings: ["view"],
    }),
  },
  {
    id: "role-support",
    name: "Support",
    description: "Customer lookup and order status help.",
    warehouseScoped: false,
    permissions: perms({
      dashboard: ["view"],
      orders: ["view", "edit"],
      products: ["view"],
      customers: ["view"],
    }),
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "adm-01",
    name: "Amelia West",
    email: "amelia.west@westwinds.ca",
    roleId: "role-owner",
    avatarInitials: "AW",
    active: true,
    lastLoginAt: daysAgo(0, 8),
  },
  {
    id: "adm-02",
    name: "Priya Singh",
    email: "priya.singh@westwinds.ca",
    roleId: "role-ops",
    avatarInitials: "PS",
    active: true,
    lastLoginAt: daysAgo(0, 7),
  },
  {
    id: "adm-03",
    name: "Marcus Chen",
    email: "marcus.chen@westwinds.ca",
    roleId: "role-warehouse",
    warehouseId: "wh-brw",
    avatarInitials: "MC",
    active: true,
    lastLoginAt: daysAgo(1, 6),
  },
  {
    id: "adm-04",
    name: "Elena Petrova",
    email: "elena.petrova@westwinds.ca",
    roleId: "role-warehouse",
    warehouseId: "wh-etx",
    avatarInitials: "EP",
    active: true,
    lastLoginAt: daysAgo(1, 9),
  },
  {
    id: "adm-05",
    name: "James Okonkwo",
    email: "james.okonkwo@westwinds.ca",
    roleId: "role-warehouse",
    warehouseId: "wh-hmd",
    avatarInitials: "JO",
    active: true,
    lastLoginAt: daysAgo(2, 7),
  },
  {
    id: "adm-06",
    name: "Sofia Alvarez",
    email: "sofia.alvarez@westwinds.ca",
    roleId: "role-warehouse",
    warehouseId: "wh-mdc",
    avatarInitials: "SA",
    active: true,
    lastLoginAt: daysAgo(0, 10),
  },
  {
    id: "adm-07",
    name: "Noah Patel",
    email: "noah.patel@westwinds.ca",
    roleId: "role-sales",
    avatarInitials: "NP",
    active: true,
    lastLoginAt: daysAgo(0, 11),
  },
  {
    id: "adm-08",
    name: "Grace Kim",
    email: "grace.kim@westwinds.ca",
    roleId: "role-sales",
    avatarInitials: "GK",
    active: true,
    lastLoginAt: daysAgo(3, 13),
  },
  {
    id: "adm-09",
    name: "Liam O'Brien",
    email: "liam.obrien@westwinds.ca",
    roleId: "role-accountant",
    avatarInitials: "LO",
    active: true,
    lastLoginAt: daysAgo(1, 15),
  },
  {
    id: "adm-10",
    name: "Aisha Rahman",
    email: "aisha.rahman@westwinds.ca",
    roleId: "role-support",
    avatarInitials: "AR",
    active: true,
    lastLoginAt: daysAgo(0, 12),
  },
  {
    id: "adm-11",
    name: "Ben Carver",
    email: "ben.carver@westwinds.ca",
    roleId: "role-ops",
    avatarInitials: "BC",
    active: true,
    lastLoginAt: daysAgo(4, 8),
  },
  {
    id: "adm-12",
    name: "Maya Thompson",
    email: "maya.thompson@westwinds.ca",
    roleId: "role-support",
    avatarInitials: "MT",
    active: false,
    lastLoginAt: daysAgo(40, 9),
  },
];

export const roleById = Object.fromEntries(roles.map((r) => [r.id, r])) as Record<
  string,
  Role
>;

export const adminUserById = Object.fromEntries(
  adminUsers.map((u) => [u.id, u]),
) as Record<string, AdminUser>;
