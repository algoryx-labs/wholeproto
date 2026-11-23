"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@westwinds/lib";
import { Badge, Button, Logo, ScrollArea } from "@westwinds/ui";
import { navGroups } from "@/lib/nav";
import { filterNavByRole } from "@/lib/roles";
import { useSessionStore } from "@/stores/session-store";
import { useLowStockCount, usePendingOrdersCount } from "@/lib/hooks";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const roleId = useSessionStore((s) => s.roleId);
  const groups = React.useMemo(
    () => filterNavByRole(navGroups, roleId),
    [roleId],
  );
  const { data: pendingOrders = 0 } = usePendingOrdersCount();
  const { data: lowStock = 0 } = useLowStockCount();

  const badges: Record<string, number> = {
    pendingOrders,
    lowStock,
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      <div className="relative flex h-14 items-center justify-between gap-1 border-b border-[var(--border)] px-2">
        <Logo size="sm" showWordmark={!collapsed} wordmark="Admin" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {group.label}
                </p>
              ) : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  const count = item.badge ? badges[item.badge] : 0;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                            : "text-[var(--foreground)] hover:bg-[var(--surface-sunken)]",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed ? (
                          <>
                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>
                            {count && count > 0 ? (
                              <Badge
                                variant={
                                  item.badge === "lowStock"
                                    ? "warning"
                                    : "soft"
                                }
                                className="h-5 min-w-5 justify-center px-1.5 text-[10px]"
                              >
                                {count > 99 ? "99+" : count}
                              </Badge>
                            ) : null}
                          </>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
