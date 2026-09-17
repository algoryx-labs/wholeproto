"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getLowStockAlerts,
  getStockLevels,
  getWarehouses,
  HONEYCRISP_SKU,
  productById,
  type Transfer,
} from "@westwinds/data";
import {
  Button,
  Card,
  CardContent,
  Input,
  PageHeader,
  QuantityStepper,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@westwinds/ui";
import { useInventoryStore } from "@/stores/inventory-store";
import { useSessionStore } from "@/stores/session-store";

type LineDraft = {
  productId: string;
  sku: string;
  productName: string;
  qty: number;
};

export default function NewTransferPage() {
  const router = useRouter();
  const email = useSessionStore((s) => s.email);
  const createTransfer = useInventoryStore((s) => s.createTransfer);

  const [step, setStep] = React.useState(1);
  const [fromId, setFromId] = React.useState("wh-brw");
  const [toId, setToId] = React.useState("wh-mdc");
  const [lines, setLines] = React.useState<LineDraft[]>([]);
  const [notes, setNotes] = React.useState(
    "Replenish Mississauga from Brampton surplus",
  );

  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const suggestionsQ = useQuery({
    queryKey: ["transfer-suggestions", fromId, toId],
    queryFn: async () => {
      const [lowAtDest, stockAtSource] = await Promise.all([
        getLowStockAlerts(toId),
        getStockLevels({ warehouseId: fromId }),
      ]);
      const healthySource = new Set(
        stockAtSource
          .filter((s) => s.health === "in_stock" && s.available >= 8)
          .map((s) => s.productId),
      );
      const picks = lowAtDest
        .filter((s) => healthySource.has(s.productId))
        .slice(0, 6)
        .map((s) => {
          const p = productById[s.productId]!;
          return {
            productId: p.id,
            sku: p.sku,
            productName: p.name,
            qty: Math.max(6, Math.ceil((p.reorderPoint || 10) * 0.8)),
          };
        });
      // Ensure Honeycrisp is suggested for the demo story
      if (!picks.some((p) => p.sku === HONEYCRISP_SKU)) {
        const honey = Object.values(productById).find(
          (p) => p.sku === HONEYCRISP_SKU,
        );
        if (honey) {
          picks.unshift({
            productId: honey.id,
            sku: honey.sku,
            productName: honey.name,
            qty: 24,
          });
        }
      }
      return picks;
    },
    enabled: Boolean(fromId && toId && fromId !== toId),
  });

  function addSuggestion(item: LineDraft) {
    setLines((prev) => {
      if (prev.some((l) => l.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }

  function submit() {
    if (!fromId || !toId || fromId === toId || lines.length === 0) return;
    const id = `trf-local-${Date.now()}`;
    const number = `TRF-${String(90000 + (Date.now() % 1000)).padStart(5, "0")}`;
    const now = new Date().toISOString();
    const transfer: Transfer = {
      id,
      number,
      fromWarehouseId: fromId,
      toWarehouseId: toId,
      status: "requested",
      lines: lines.map((l, i) => ({
        id: `${id}-l${i}`,
        productId: l.productId,
        sku: l.sku,
        productName: l.productName,
        requestedQty: l.qty,
        shippedQty: l.qty,
        receivedQty: 0,
      })),
      requestedBy: email.split("@")[0]?.replace(".", " ") ?? "Demo User",
      notes,
      createdAt: now,
      updatedAt: now,
    };
    createTransfer(transfer);
    toast.success("Transfer requested", {
      description: `${number} · ${lines.length} line(s)`,
    });
    router.push(`/transfers/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New transfer"
        description="Request stock movement between warehouses."
        breadcrumbs={[
          { label: "Transfers", href: "/transfers" },
          { label: "New" },
        ]}
      />

      <div className="flex gap-2 text-sm">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`rounded-full px-3 py-1 ${
              step === n
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--surface-sunken)] text-[var(--muted-foreground)]"
            }`}
          >
            {n === 1 ? "Route" : n === 2 ? "Products" : "Confirm"}
          </span>
        ))}
      </div>

      {warehousesQ.isLoading ? (
        <Skeleton className="h-40" />
      ) : step === 1 ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">From</p>
                <Select value={fromId} onValueChange={setFromId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(warehousesQ.data ?? []).map((w) => (
                      <SelectItem key={w.id} value={w.id} disabled={w.id === toId}>
                        {w.code} — {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">To</p>
                <Select value={toId} onValueChange={setToId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(warehousesQ.data ?? []).map((w) => (
                      <SelectItem
                        key={w.id}
                        value={w.id}
                        disabled={w.id === fromId}
                      >
                        {w.code} — {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="button" onClick={() => setStep(2)}>
              Continue
            </Button>
          </CardContent>
        </Card>
      ) : step === 2 ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <p className="mb-2 text-sm font-medium">
                Suggested (low at destination, healthy at source)
              </p>
              <div className="flex flex-wrap gap-2">
                {(suggestionsQ.data ?? []).map((s) => (
                  <Button
                    key={s.productId}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addSuggestion(s)}
                  >
                    + {s.productName}
                  </Button>
                ))}
              </div>
            </div>
            <ul className="space-y-3">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{line.productName}</p>
                    <p className="text-xs tabular text-[var(--muted-foreground)]">
                      {line.sku}
                    </p>
                  </div>
                  <QuantityStepper
                    value={line.qty}
                    min={1}
                    max={200}
                    onChange={(qty) =>
                      setLines((prev) =>
                        prev.map((l) =>
                          l.productId === line.productId ? { ...l, qty } : l,
                        ),
                      )
                    }
                  />
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                disabled={lines.length === 0}
                onClick={() => setStep(3)}
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm">
              {(warehousesQ.data ?? []).find((w) => w.id === fromId)?.code} →{" "}
              {(warehousesQ.data ?? []).find((w) => w.id === toId)?.code} ·{" "}
              {lines.length} products
            </p>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="button" onClick={submit}>
                Request transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
