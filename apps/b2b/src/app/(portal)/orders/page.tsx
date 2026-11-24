"use client";

import Link from "next/link";
import { toast } from "sonner";
import { formatDate } from "@calgarywholesale/lib";
import {
  Badge,
  Button,
  EmptyState,
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
} from "@calgarywholesale/ui";
import { Package } from "lucide-react";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";
import { isPickup } from "@/lib/pickups";
import { useCartStore } from "@/stores/cart-store";

export default function OrdersPage() {
  const { orders, isLoading } = useLakeshoreOrders();
  const addLine = useCartStore((s) => s.addLine);

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    for (const line of order.lines) {
      addLine({
        productId: line.productId,
        sku: line.sku,
        name: line.name,
        qty: line.quantity,
        unitPrice: line.unitPrice,
      });
    }
    toast.success(`Reordered ${order.number} into cart`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Lakeshore Fresh Trade history, including CW-B-10482 and new checkouts."
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="Place a Trade order from the catalog or quick order."
          action={
            <Button asChild>
              <Link href="/catalog">Browse catalog</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PO</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium hover:text-[var(--primary)]"
                    >
                      {order.number}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--muted-foreground)]">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={order.status} showIcon={false} />
                      {isPickup(order) ? (
                        <Badge variant="outline">Pickup</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.poNumber ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={order.total} className="font-medium" />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => reorder(order.id)}
                    >
                      Reorder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
