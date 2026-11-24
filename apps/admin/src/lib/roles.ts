import { roles, type PermissionModule, type Role } from "@calgarywholesale/data";
import type { NavGroup, NavItem } from "./nav";

const MODULE_ALIASES: Record<string, PermissionModule> = {
  storefront: "products",
  categories: "products",
  promotions: "pricing",
  activity: "settings",
};

export function resolveModule(
  module: NavItem["module"],
): PermissionModule {
  return (MODULE_ALIASES[module] ?? module) as PermissionModule;
}

export function roleCanView(role: Role | undefined, module: NavItem["module"]) {
  if (!role) return true;
  const key = resolveModule(module);
  const perm = role.permissions.find((p) => p.module === key);
  return Boolean(perm?.actions.includes("view"));
}

export function filterNavByRole(
  groups: NavGroup[],
  roleId: string | null,
): NavGroup[] {
  const role = roles.find((r) => r.id === roleId);
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => roleCanView(role, item.module)),
    }))
    .filter((group) => group.items.length > 0);
}

export const VIEW_AS_ROLES = [
  { id: "role-owner", label: "Owner" },
  { id: "role-ops", label: "Operations manager" },
  { id: "role-warehouse", label: "Warehouse staff" },
  { id: "role-sales", label: "Sales manager" },
  { id: "role-accountant", label: "Accountant" },
  { id: "role-support", label: "Support" },
] as const;
