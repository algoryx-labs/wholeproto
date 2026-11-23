"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { parseAsStringEnum, useQueryState } from "nuqs";
import {
  DEMO_B2B_ORDER_NUMBER,
  getOrders,
  warehouseById,
} from "@westwinds/data";
import {
  Badge,
  Money,
  PageHeader,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@westwinds/ui";
import { useOrderStore } from "@/stores/order-store";

const channelParser = parseAsStringEnum(["all", "b2b", "b2c"] as const).withDefault(
  "all",
);

export default function OrdersPage() {
  const [channel, setChannel] = useQueryState("channel", channelParser);
  const getStatus = useOrderStore((s) => s.getStatus);
  const getWarehouse = useOrderStore((s) => s.getWarehouse);

  const ordersQ = useQuery({
    queryKey: ["orders", channel],
    queryFn: () =>
      getOrders(
        channel === "all" ? {} : { channel: channel === "b2c" ? "b2c" : "b2b" },
      ),
  });

  const orders = [...(ordersQ.data ?? [])].sort((a, b) => {
    if (a.number === DEMO_B2B_ORDER_NUMBER) return -1;
    if (b.number === DEMO_B2B_ORDER_NUMBER) return 1;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="B2B Trade and consumer app orders on one board."
      />

      <Tabs
        value={channel}
        onValueChange={(v) => setChannel(v as "all" | "b2b" | "b2c")}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="b2b">B2B</TabsTrigger>
          <TabsTrigger value="b2c">App</TabsTrigger>
        </TabsList>
      </Tabs>

      {ordersQ.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => {
                const status = getStatus(o.id, o.status);
                const whId = getWarehouse(o.id, o.warehouseId);
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
                    <TableCell className="max-w-[180px] truncate">
                      {name}
                    </TableCell>
                    <TableCell>
                      {warehouseById[whId]?.code ?? whId}
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
        </div>
      )}
    </div>
  );
}
