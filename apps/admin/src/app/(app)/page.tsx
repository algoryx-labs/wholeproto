"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import {
  getActivity,
  getDailySales,
  getLowStockAlerts,
  getOrders,
  getQuickBooksLogs,
  getStockLevels,
  getWarehouses,
  HONEYCRISP_SKU,
  productById,
  warehouseById,
} from "@calgarywholesale/data";
import { formatCurrency } from "@calgarywholesale/lib";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Money,
  PageHeader,
  SectionCard,
  Skeleton,
  StatCard,
  StatusBadge,
  StockHealth,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { useSessionStore } from "@/stores/session-store";
import { useInventoryStore, stockKey } from "@/stores/inventory-store";
import { useOrderStore } from "@/stores/order-store";

export default function DashboardPage() {
  const email = useSessionStore((s) => s.email);
  const scope = useSessionStore((s) => s.warehouseScopeId);
  const overrides = useInventoryStore((s) => s.stockOverrides);
  const getStatus = useOrderStore((s) => s.getStatus);

  const salesQ = useQuery({
    queryKey: ["daily-sales"],
    queryFn: () => getDailySales(14),
  });
  const ordersQ = useQuery({
    queryKey: ["orders", "dashboard"],
    queryFn: () => getOrders(),
  });
  const lowQ = useQuery({
    queryKey: ["low-stock", scope],
    queryFn: () => getLowStockAlerts(scope === "all" ? undefined : scope),
  });
  const activityQ = useQuery({
    queryKey: ["activity"],
    queryFn: () => getActivity(8),
  });
  const qbQ = useQuery({
    queryKey: ["qb-logs"],
    queryFn: () => getQuickBooksLogs(5),
  });
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const stockQ = useQuery({
    queryKey: ["stock-levels", "health-summary"],
    queryFn: () => getStockLevels(),
  });

  const firstName = email.split("@")[0]?.split(".")[0] ?? "there";
  const greetingName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const todaySales = salesQ.data?.at(-1);
  const weekSales = salesQ.data?.slice(-7) ?? [];
  const weekRevenue = weekSales.reduce((s, d) => s + d.totalRevenue, 0);
  const openOrders =
    ordersQ.data?.filter(
      (o) => !["delivered", "cancelled"].includes(getStatus(o.id, o.status)),
    ).length ?? 0;

  const lowItems = (lowQ.data ?? [])
    .map((a) => {
      const product = productById[a.productId];
      const key = stockKey(a.productId, a.warehouseId);
      const cell = overrides[key];
      const available = cell?.available ?? a.available;
      const health = cell?.health ?? a.health;
      return {
        ...a,
        sku: product?.sku,
        name: product?.name,
        available,
        health,
      };
    })
    .filter((a) => a.health === "low_stock" || a.health === "out_of_stock")
    .sort((a, b) => {
      if (a.sku === HONEYCRISP_SKU) return -1;
      if (b.sku === HONEYCRISP_SKU) return 1;
      return a.available - b.available;
    })
    .slice(0, 6);

  const warehouses = warehousesQ.data ?? [];
  const stockLevels = stockQ.data ?? [];
  const healthByWh = warehouses.map((w) => {
    const levels = stockLevels
      .filter((s) => s.warehouseId === w.id)
      .map((s) => {
        const cell = overrides[stockKey(s.productId, s.warehouseId)];
        return cell ?? s;
      });
    const low = levels.filter((s) => s.health === "low_stock").length;
    const out = levels.filter((s) => s.health === "out_of_stock").length;
    const healthy = levels.length - low - out;
    return { warehouse: w, healthy, low, out, total: levels.length };
  });

  const latestOrders = (ordersQ.data ?? []).slice(0, 6);
  const loading =
    salesQ.isLoading || ordersQ.isLoading || lowQ.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good ${hourGreeting()}, ${greetingName}`}
        description={format(new Date(), "EEEE, MMMM d, yyyy")}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[var(--radius-md)]" />
          ))
        ) : (
          <>
            <StatCard
              label="Today's revenue"
              value={todaySales?.totalRevenue ?? 0}
              formatValue={formatCurrency}
            />
            <StatCard
              label="7-day revenue"
              value={weekRevenue}
              formatValue={formatCurrency}
            />
            <StatCard label="Open orders" value={openOrders} />
            <StatCard
              label="Low-stock SKUs"
              value={new Set(lowItems.map((i) => i.productId)).size}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Low stock"
          description="Needs attention before next pick wave"
          className="xl:col-span-1"
          actions={
            <Link
              href="/inventory"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View matrix
            </Link>
          }
        >
          {lowQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {lowItems.map((item) => (
                <li
                  key={`${item.productId}-${item.warehouseId}`}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/inventory/${item.sku}`}
                      className="truncate text-sm font-medium hover:text-[var(--primary)]"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs tabular text-[var(--muted-foreground)]">
                      {item.sku} · {warehouseById[item.warehouseId]?.code}
                    </p>
                  </div>
                  <StockHealth
                    variant="cell"
                    onHand={item.available}
                    reorderPoint={productById[item.productId]?.reorderPoint ?? 10}
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Latest orders"
          description="B2B Trade and consumer app"
          className="xl:col-span-2"
          actions={
            <Link
              href="/orders"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              All orders
            </Link>
          }
        >
          {ordersQ.isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestOrders.map((o) => {
                  const status = getStatus(o.id, o.status);
                  const name =
                    o.channel === "b2b" ? o.customerName : o.consumerName;
                  return (
                    <TableRow key={o.id}>
                      <TableCell>
                        <Link
                          href={`/orders/${o.id}`}
                          className="font-medium tabular text-[var(--primary)] hover:underline"
                        >
                          {o.number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={o.channel === "b2b" ? "info" : "soft"}>
                          {o.channel === "b2b" ? "B2B" : "App"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Money amount={o.total} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Activity" className="lg:col-span-1">
          {activityQ.isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <ul className="space-y-3">
              {(activityQ.data ?? []).map((e) => (
                <li key={e.id} className="text-sm">
                  <p className="font-medium">{e.action}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {e.actorName} · {e.entityLabel}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">QuickBooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status="active" label="Connected" />
              <span className="text-xs text-[var(--muted-foreground)]">
                Calgary Wholesale Online company file
              </span>
            </div>
            <ul className="space-y-2 text-sm">
              {(qbQ.data ?? []).slice(0, 3).map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="truncate">{log.entityLabel}</span>
                  <StatusBadge status={log.status} showIcon={false} />
                </li>
              ))}
            </ul>
            <Link
              href="/integrations"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Open integrations
            </Link>
          </CardContent>
        </Card>

        <SectionCard title="Stock health by warehouse">
          {stockQ.isLoading || warehousesQ.isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <ul className="space-y-3">
              {healthByWh.map(({ warehouse, healthy, low, out, total }) => (
                <li key={warehouse.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{warehouse.code}</span>
                    <span className="tabular text-[var(--muted-foreground)]">
                      {total} SKUs
                    </span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                    <span
                      className="bg-[var(--success)]"
                      style={{ width: `${(healthy / Math.max(total, 1)) * 100}%` }}
                    />
                    <span
                      className="bg-[var(--warning)]"
                      style={{ width: `${(low / Math.max(total, 1)) * 100}%` }}
                    />
                    <span
                      className="bg-[var(--danger)]"
                      style={{ width: `${(out / Math.max(total, 1)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function hourGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
