"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOrder,
  getWarehouses,
  warehouseById,
} from "@calgarywholesale/data";
import { formatDate } from "@calgarywholesale/lib";
import {
  Badge,
  Button,
  KeyValueList,
  Money,
  PageHeader,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
} from "@calgarywholesale/ui";
import { nextOrderStatus, useOrderStore } from "@/stores/order-store";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const getStatus = useOrderStore((s) => s.getStatus);
  const getWarehouse = useOrderStore((s) => s.getWarehouse);
  const getExtraHistory = useOrderStore((s) => s.getExtraHistory);
  const advanceStatus = useOrderStore((s) => s.advanceStatus);
  const setWarehouse = useOrderStore((s) => s.setWarehouse);

  const orderQ = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const order = orderQ.data;
  if (orderQ.isLoading) return <Skeleton className="h-72 w-full" />;
  if (!order) {
    return (
      <PageHeader title="Order not found" description={`No order for ${id}.`} />
    );
  }

  const status = getStatus(order.id, order.status);
  const warehouseId = getWarehouse(order.id, order.warehouseId);
  const next = nextOrderStatus(order.channel, status);
  const customer =
    order.channel === "b2b" ? order.customerName : order.consumerName;

  const history = [
    ...order.statusHistory,
    ...getExtraHistory(order.id),
  ].map((h, i) => ({
    id: `${order.id}-h${i}`,
    status: h.status,
    at: h.at,
    actor: h.by,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.number}
        description={`${customer} · ${formatDate(order.createdAt)}`}
        breadcrumbs={[
          { label: "Orders", href: "/orders" },
          { label: order.number },
        ]}
        actions={
          next ? (
            <Button
              type="button"
              onClick={() => {
                advanceStatus(order.id, order.channel, order.status);
                toast.success(`Status advanced to ${next.replace(/_/g, " ")}`);
              }}
            >
              Advance to {next.replace(/_/g, " ")}
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={order.channel === "b2b" ? "info" : "soft"}>
          {order.channel === "b2b" ? "B2B" : "App"}
        </Badge>
        <StatusBadge status={status} />
        <StatusBadge status={order.paymentStatus} showIcon={false} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Lines" className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Line</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <p className="font-medium">{line.name}</p>
                    <p className="text-xs tabular text-[var(--muted-foreground)]">
                      {line.sku}
                    </p>
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {line.quantity} {line.uom}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={line.unitPrice} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={line.lineTotal} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-y-1 border-t border-[var(--border)] pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <Money amount={order.subtotal} />
            </div>
            <div className="flex justify-between text-[var(--muted-foreground)]">
              <span>GST ({Math.round(order.taxRate * 100)}%)</span>
              <Money amount={order.taxAmount} />
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <Money amount={order.total} />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Fulfilment">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Warehouse
                </p>
                <Select
                  value={warehouseId}
                  onValueChange={(v) => setWarehouse(order.id, v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(warehousesQ.data ?? []).map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.code} — {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <KeyValueList
                items={[
                  {
                    key: "assigned",
                    label: "Assigned",
                    value: warehouseById[warehouseId]?.name ?? warehouseId,
                  },
                  ...(order.channel === "b2b" && order.poNumber
                    ? [{ key: "po", label: "PO", value: order.poNumber }]
                    : []),
                  ...(order.channel === "b2b" && order.deliveryDate
                    ? [
                        {
                          key: "delivery",
                          label: "Delivery",
                          value: order.deliveryDate,
                        },
                      ]
                    : []),
                  ...(order.channel === "b2c" && order.deliverySlot
                    ? [
                        {
                          key: "slot",
                          label: "Slot",
                          value: order.deliverySlot,
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </SectionCard>
          <SectionCard title="Timeline">
            <Timeline items={history} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
