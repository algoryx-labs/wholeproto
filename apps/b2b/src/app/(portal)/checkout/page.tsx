"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
import {
  lakeshoreCustomer,
  type B2BOrder,
  type OrderLine,
} from "@westwinds/data";
import { brand } from "@westwinds/lib";
import {
  Button,
  Input,
  Label,
  Money,
  PageHeader,
  SectionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@westwinds/ui";
import { AlertTriangle } from "lucide-react";
import { newPickupCode, PICKUP_WAREHOUSES, PICKUP_WINDOWS } from "@/lib/pickups";
import { orderTotals } from "@/lib/pricing";
import { useCartStore } from "@/stores/cart-store";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";
import { useSessionStore } from "@/stores/session-store";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const addOrder = useOrdersOverlayStore((s) => s.addOrder);
  const role = useSessionStore((s) => s.role);
  const approvalLimit = useSessionStore((s) => s.approvalLimit);
  const user = useSessionStore((s) => s.user);
  const locationId = useSessionStore((s) => s.locationId);

  const [locId, setLocId] = React.useState(locationId);
  const [fulfill, setFulfill] = React.useState<"delivery" | "pickup">("delivery");
  const [date, setDate] = React.useState(
    format(addDays(new Date("2026-09-17"), 2), "yyyy-MM-dd"),
  );
  const [pickupWarehouseId, setPickupWarehouseId] = React.useState("wh-mdc");
  const [pickupDate, setPickupDate] = React.useState(
    format(addDays(new Date("2026-09-17"), 1), "yyyy-MM-dd"),
  );
  const [pickupWindow, setPickupWindow] = React.useState<string>(PICKUP_WINDOWS[1]);
  const [pickupContact, setPickupContact] = React.useState(user?.name ?? "");
  const [vehicle, setVehicle] = React.useState("");
  const [po, setPo] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const subtotal =
    Math.round(lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0) * 100) /
    100;
  const totals = orderTotals(subtotal);
  const needsApproval = role === "Buyer" && totals.total > approvalLimit;
  const location =
    lakeshoreCustomer.locations.find((l) => l.id === locId) ??
    lakeshoreCustomer.locations[0]!;

  React.useEffect(() => {
    setLocId(locationId);
  }, [locationId]);

  const placeOrder = () => {
    if (!lines.length) return;
    setSubmitting(true);
    const seq = 10500 + Math.floor(Math.random() * 400);
    const id = `ord-b2b-local-${seq}`;
    const number = `CW-B-${seq}`;
    const now = new Date().toISOString();
    const orderLines: OrderLine[] = lines.map((l, i) => ({
      id: `${id}-line-${i + 1}`,
      productId: l.productId,
      sku: l.sku,
      name: l.name,
      quantity: l.qty,
      unitPrice: l.unitPrice,
      lineTotal: Math.round(l.qty * l.unitPrice * 100) / 100,
      uom: "case",
    }));

    const status = needsApproval ? "pending_approval" : "confirmed";
    const isPickup = fulfill === "pickup";
    const pickupCode = newPickupCode();
    const order: B2BOrder = {
      id,
      number,
      channel: "b2b",
      status,
      customerId: lakeshoreCustomer.id,
      customerName: lakeshoreCustomer.name,
      warehouseId: isPickup ? pickupWarehouseId : "wh-mdc",
      lines: orderLines,
      subtotal: totals.subtotal,
      taxRate: totals.taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      paymentStatus: "unpaid",
      poNumber: po || undefined,
      deliveryAddress: location,
      deliveryDate: isPickup ? undefined : date,
      fulfillment: fulfill,
      pickup: isPickup
        ? {
            warehouseId: pickupWarehouseId,
            date: pickupDate,
            window: pickupWindow,
            code: pickupCode,
            contactName: pickupContact || undefined,
            vehicle: vehicle || undefined,
          }
        : undefined,
      notes: notes || undefined,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        { status: "pending_approval", at: now, by: user?.name },
        ...(needsApproval
          ? []
          : [{ status: "confirmed", at: now, by: "Calgary Wholesale Ops" }]),
      ],
    };

    addOrder(order);
    clear();
    toast.success(
      needsApproval
        ? "Order submitted for approval"
        : isPickup
          ? `Order ${number} confirmed · pickup code ${pickupCode}`
          : `Order ${number} confirmed`,
    );
    router.push(`/orders/confirmation/${id}`);
  };

  if (!lines.length) {
    return (
      <div className="space-y-4">
        <PageHeader title="Checkout" description="Your cart is empty." />
        <Button asChild variant="outline">
          <Link href="/catalog">Browse catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checkout"
        description="Confirm delivery details and place your Trade order."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <SectionCard title="Fulfillment">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={locId} onValueChange={setLocId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lakeshoreCustomer.locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.label} · {loc.line1}, {loc.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Method</Label>
                <Select
                  value={fulfill}
                  onValueChange={(v) => setFulfill(v as "delivery" | "pickup")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="pickup">Warehouse pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fulfill === "delivery" ? (
                <div className="space-y-2">
                  <Label htmlFor="date">Delivery date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Pickup warehouse</Label>
                    <Select
                      value={pickupWarehouseId}
                      onValueChange={setPickupWarehouseId}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PICKUP_WAREHOUSES.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name} · {w.address.line1}, {w.address.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickup-date">Pickup date</Label>
                    <Input
                      id="pickup-date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time window</Label>
                    <Select value={pickupWindow} onValueChange={setPickupWindow}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PICKUP_WINDOWS.map((w) => (
                          <SelectItem key={w} value={w}>
                            {w}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickup-contact">Picked up by</Label>
                    <Input
                      id="pickup-contact"
                      value={pickupContact}
                      onChange={(e) => setPickupContact(e.target.value)}
                      placeholder="Driver or staff name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle / plate</Label>
                    <Input
                      id="vehicle"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      placeholder="White van · CBRT 418"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="po">PO number</Label>
                <Input
                  id="po"
                  value={po}
                  onChange={(e) => setPo(e.target.value)}
                  placeholder="PO-LF-4520"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dock hours, lift-gate, receiver name…"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Payment">
            <p className="text-sm">
              Charged to account terms:{" "}
              <span className="font-semibold">{lakeshoreCustomer.terms}</span>
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Invoice issued after shipment. No card payment required at checkout.
            </p>
          </SectionCard>

          {needsApproval ? (
            <div className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--warning)]/40 bg-[var(--warning-soft)] px-4 py-3 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
              <div>
                <p className="font-medium text-[var(--warning)]">
                  Approval required
                </p>
                <p className="text-[var(--foreground)]/80">
                  As a Buyer your limit is{" "}
                  <Money amount={approvalLimit} className="font-medium" />. This
                  order totals <Money amount={totals.total} className="font-medium" />{" "}
                  and will be submitted as <strong>pending approval</strong> for
                  an Approver or Account admin.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <SectionCard title="Order summary">
          <ul className="mb-3 max-h-48 space-y-2 overflow-y-auto text-sm">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-2">
                <span className="truncate">
                  {l.name} × {l.qty}
                </span>
                <Money amount={Math.round(l.qty * l.unitPrice * 100) / 100} />
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-[var(--border)] pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
              <dd>
                <Money amount={totals.subtotal} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">
                {brand.taxLabel} {Math.round(brand.taxRate * 100)}%
              </dt>
              <dd>
                <Money amount={totals.taxAmount} />
              </dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total CAD</dt>
              <dd>
                <Money amount={totals.total} />
              </dd>
            </div>
          </dl>
          <Button
            type="button"
            className="mt-4 w-full"
            disabled={submitting}
            onClick={placeOrder}
          >
            {needsApproval ? "Submit for approval" : "Place order"}
          </Button>
        </SectionCard>
      </div>
    </div>
  );
}
