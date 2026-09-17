import type { PermissionModule } from "@westwinds/data";
import {
  Activity,
  Boxes,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Package,
  Percent,
  Plug,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  Users,
  Warehouse,
  ArrowLeftRight,
  SlidersHorizontal,
  Store,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  module: PermissionModule | "storefront" | "categories" | "promotions" | "activity";
  badge?: "pendingOrders" | "lowStock";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        module: "dashboard",
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        label: "Orders",
        href: "/orders",
        icon: ShoppingBag,
        module: "orders",
        badge: "pendingOrders",
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/products", icon: Package, module: "products" },
      {
        label: "Categories",
        href: "/categories",
        icon: Tags,
        module: "categories",
      },
      { label: "Pricing", href: "/pricing", icon: Percent, module: "pricing" },
      {
        label: "Promotions",
        href: "/promotions",
        icon: Percent,
        module: "promotions",
      },
      {
        label: "App storefront",
        href: "/storefront",
        icon: Store,
        module: "storefront",
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        label: "Stock levels",
        href: "/inventory",
        icon: Boxes,
        module: "inventory",
        badge: "lowStock",
      },
      {
        label: "Transfers",
        href: "/transfers",
        icon: ArrowLeftRight,
        module: "transfers",
      },
      {
        label: "Adjustments",
        href: "/adjustments",
        icon: SlidersHorizontal,
        module: "inventory",
      },
      {
        label: "Warehouses",
        href: "/warehouses",
        icon: Warehouse,
        module: "warehouses",
      },
    ],
  },
  {
    label: "Customers",
    items: [
      {
        label: "B2B accounts",
        href: "/customers/b2b",
        icon: Building2,
        module: "customers",
      },
      {
        label: "App customers",
        href: "/customers/app",
        icon: Users,
        module: "customers",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: ClipboardList,
        module: "reports",
      },
      {
        label: "Activity log",
        href: "/activity",
        icon: Activity,
        module: "activity",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Integrations",
        href: "/integrations",
        icon: Plug,
        module: "integrations",
      },
      { label: "Users & roles", href: "/users", icon: Users, module: "users" },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        module: "settings",
      },
    ],
  },
];

export const searchablePages = navGroups.flatMap((g) =>
  g.items.map((item) => ({
    label: item.label,
    href: item.href,
    group: g.label,
  })),
);
