"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@westwinds/lib";
import {
  Button,
  Money,
  PageHeader,
  SectionCard,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
} from "@westwinds/ui";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";
import { useLakeshoreOrders } from "@/hooks/use-lakeshore-orders";
import { isPickup, warehouseFor } from "@/lib/pickups";
import { useCartStore } from "@/stores/cart-store";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { orders, isLoading } = useLakeshoreOrders();
  const overlay = useOrdersOverlayStore((s) => s.getOrder(params.id));
  const addLine = useCartStore((s) => s.addLine);
  const { invoices } = useLakeshoreBilling();

  const order =
    overlay ??
    orders.find((o) => o.id === params.id || o.number === params.id);
  const invoice = order ? invoices.find((i) => i.orderId === order.id) : undefined;

  if (isLoading && !order) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <PageHeader title="Order not found" />
        <Button asChild variant="outline">
          <Link href="/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const pickup = isPickup(order) ? order.pickup! : null;
  const pickupWarehouse = pickup ? warehouseFor(pickup.warehouseId) : null;

  const reorder = () => {
    for (const line of order.lines) {
      addLine({
        productId: line.productId,
        sku: line.sku,
        name: line.name,
        qty: line.quantity,
        unitPrice: line.unitPrice,
      });
    }
    toast.success(`Added ${order.lines.length} lines to cart`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.number}
        description={`Placed ${formatDate(order.createdAt)} · ${order.customerName}`}
        breadcrumbs={[
          { label: "Orders", href: "/orders" },
          { label: order.number },
        ]}
        actions={
          <>
            <StatusBadge status={order.status} />
            {invoice ? (
              <Button asChild variant="outline">
                <Link href={`/billing/invoices/${invoice.id}`}>
                  Invoice {invoice.number}
                </Link>
              </Button>
            ) : null}
            <Button type="button" variant="soft" onClick={reorder}>
              Reorder
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title={pickup ? "Pickup" : "Delivery"}
          className="lg:col-span-1"
          actions={
            pickup ? (
              <Button asChild size="sm" variant="ghost">
                <Link href="/pickups">Manage</Link>
              </Button>
            ) : null
          }
        >
          <dl className="space-y-2 text-sm">
            {pickup ? (
              <>
                <div>
                  <dt className="text-[var(--muted-foreground)]">Pickup code</dt>
                  <dd className="font-mono text-lg font-semibold tracking-widest">
                    {pickup.code}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted-foreground)]">Warehouse</dt>
                  <dd className="font-medium">
                    {pickupWarehouse!.name}
                    <br />
                    <span className="font-normal text-[var(--muted-foreground)]">
                      {pickupWarehouse!.address.line1}, {pickupWarehouse!.address.city}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted-foreground)]">Slot</dt>
                  <dd className="font-medium">
                    {formatDate(`${pickup.date}T12:00:00`)} · {pickup.window}
                  </dd>
                </div>
                {pickup.contactName ? (
                  <div>
                    <dt className="text-[var(--muted-foreground)]">Picked up by</dt>
                    <dd>
                      {pickup.contactName}
                      {pickup.vehicle ? ` · ${pickup.vehicle}` : ""}
                    </dd>
                  </div>
                ) : null}
              </>
            ) : (
              <div>
                <dt className="text-[var(--muted-foreground)]">Address</dt>
                <dd className="font-medium">
                  {order.deliveryAddress.line1}
                  <br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.province}{" "}
                  {order.deliveryAddress.postalCode}
                </dd>
              </div>
            )}
            {order.deliveryDate ? (
              <div>
                <dt className="text-[var(--muted-foreground)]">Date</dt>
                <dd className="font-medium">{formatDate(order.deliveryDate)}</dd>
              </div>
            ) : null}
            {order.poNumber ? (
              <div>
                <dt className="text-[var(--muted-foreground)]">PO</dt>
                <dd className="font-medium">{order.poNumber}</dd>
              </div>
            ) : null}
            {order.notes ? (
              <div>
                <dt className="text-[var(--muted-foreground)]">Notes</dt>
                <dd>{order.notes}</dd>
              </div>
            ) : null}
          </dl>
        </SectionCard>

        <SectionCard title="Status history" className="lg:col-span-2">
          <Timeline
            items={order.statusHistory.map((h) => ({
              id: `${h.status}-${h.at}`,
              status: h.status,
              actor: h.by,
              at: h.at,
            }))}
          />
        </SectionCard>
      </div>

      <SectionCard title="Lines">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="text-right">Line</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="font-mono text-xs">{line.sku}</TableCell>
                <TableCell>
                  <Link
                    href={`/catalog/${line.sku}`}
                    className="hover:text-[var(--primary)]"
                  >
                    {line.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right tabular">
                  {line.quantity} {line.uom}
                </TableCell>
                <TableCell className="text-right">
                  <Money amount={line.unitPrice} />
                </TableCell>
                <TableCell className="text-right">
                  <Money amount={line.lineTotal} className="font-medium" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end gap-8 text-sm">
          <div className="text-right">
            <p className="text-[var(--muted-foreground)]">Subtotal</p>
            <Money amount={order.subtotal} />
          </div>
          <div className="text-right">
            <p className="text-[var(--muted-foreground)]">HST</p>
            <Money amount={order.taxAmount} />
          </div>
          <div className="text-right">
            <p className="text-[var(--muted-foreground)]">Total</p>
            <Money amount={order.total} className="text-base font-semibold" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
