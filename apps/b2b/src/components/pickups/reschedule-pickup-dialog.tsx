"use client";

import * as React from "react";
import { toast } from "sonner";
import type { B2BOrder } from "@calgarywholesale/data";
import { formatDate } from "@calgarywholesale/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@calgarywholesale/ui";
import { PICKUP_WAREHOUSES, PICKUP_WINDOWS, warehouseFor } from "@/lib/pickups";
import { useOrdersOverlayStore } from "@/stores/orders-overlay-store";
import { useSessionStore } from "@/stores/session-store";

export interface ReschedulePickupDialogProps {
  order: B2BOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function ReschedulePickupDialog({
  order,
  onOpenChange,
}: ReschedulePickupDialogProps) {
  const saveOrder = useOrdersOverlayStore((s) => s.addOrder);
  const user = useSessionStore((s) => s.user);
  const [warehouseId, setWarehouseId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [slot, setSlot] = React.useState<string>(PICKUP_WINDOWS[0]);

  React.useEffect(() => {
    if (!order?.pickup) return;
    setWarehouseId(order.pickup.warehouseId);
    setDate(order.pickup.date);
    setSlot(order.pickup.window);
  }, [order]);

  const save = () => {
    if (!order?.pickup || !date) return;
    const now = new Date().toISOString();
    const wh = warehouseFor(warehouseId);
    saveOrder({
      ...order,
      warehouseId,
      pickup: { ...order.pickup, warehouseId, date, window: slot },
      updatedAt: now,
      statusHistory: [
        ...order.statusHistory,
        { status: "pickup_rescheduled", at: now, by: user?.name },
      ],
    });
    toast.success(
      `${order.number} pickup moved to ${formatDate(`${date}T12:00:00`)}, ${slot} at ${wh.name}`,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule pickup</DialogTitle>
          <DialogDescription>
            {order?.number} · pickup code {order?.pickup?.code}. The warehouse
            is notified of the new slot right away.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Warehouse</Label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PICKUP_WAREHOUSES.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} · {w.address.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pu-date">Date</Label>
            <Input
              id="pu-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Time window</Label>
            <Select value={slot} onValueChange={setSlot}>
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!date} onClick={save}>
            Save new slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
