"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getStockMatrix,
  getWarehouses,
  productBySku,
} from "@calgarywholesale/data";
import {
  Badge,
  FilterBar,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  StockHealth,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { useInventoryStore, stockKey } from "@/stores/inventory-store";
import { useSessionStore } from "@/stores/session-store";

export default function InventoryPage() {
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("all");
  const scope = useSessionStore((s) => s.warehouseScopeId);
  const overrides = useInventoryStore((s) => s.stockOverrides);

  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const matrixQ = useQuery({
    queryKey: ["stock-matrix", search],
    queryFn: () => getStockMatrix({ search: search || undefined }),
  });

  const warehouses = warehousesQ.data ?? [];
  const visibleWarehouses =
    scope === "all" ? warehouses : warehouses.filter((w) => w.id === scope);

  const rows = React.useMemo(() => {
    let list = matrixQ.data ?? [];
    if (categoryId !== "all") {
      list = list.filter((r) => {
        const p = productBySku[r.sku];
        return p?.categoryId === categoryId;
      });
    }
    return list.map((row) => {
      const byWarehouse = { ...row.byWarehouse };
      let totalOnHand = 0;
      let totalAvailable = 0;
      let worst: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
      for (const wh of warehouses) {
        const base = byWarehouse[wh.id];
        const ov = overrides[stockKey(row.productId, wh.id)];
        const cell = ov ?? base;
        if (cell) {
          byWarehouse[wh.id] = cell;
          totalOnHand += cell.onHand;
          totalAvailable += cell.available;
          if (cell.health === "out_of_stock") worst = "out_of_stock";
          else if (cell.health === "low_stock" && worst !== "out_of_stock")
            worst = "low_stock";
        }
      }
      return { ...row, byWarehouse, totalOnHand, totalAvailable, health: worst };
    });
  }, [matrixQ.data, categoryId, overrides, warehouses]);

  const skuCount = rows.length;
  const lowCount = rows.filter((r) => r.health === "low_stock").length;
  const outCount = rows.filter((r) => r.health === "out_of_stock").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock levels"
        description="Cin7-style matrix across Mississauga, Brampton, Etobicoke, and Hamilton."
      />

      <div className="flex flex-wrap gap-3">
        <SummaryChip label="SKUs" value={skuCount} />
        <SummaryChip label="Low" value={lowCount} tone="warning" />
        <SummaryChip label="Out" value={outCount} tone="danger" />
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name or SKU…"
        onClear={() => {
          setSearch("");
          setCategoryId("all");
        }}
        filters={
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(categoriesQ.data ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {matrixQ.isLoading || warehousesQ.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[200px] bg-[var(--surface)]">
                  Product
                </TableHead>
                <TableHead className="min-w-[110px]">SKU</TableHead>
                {visibleWarehouses.map((w) => (
                  <TableHead key={w.id} className="text-center">
                    {w.code}
                  </TableHead>
                ))}
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.productId}>
                  <TableCell className="sticky left-0 z-10 bg-[var(--surface)] font-medium">
                    <Link
                      href={`/inventory/${row.sku}`}
                      className="hover:text-[var(--primary)]"
                    >
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell className="tabular text-[var(--muted-foreground)]">
                    {row.sku}
                  </TableCell>
                  {visibleWarehouses.map((w) => {
                    const cell = row.byWarehouse[w.id];
                    return (
                      <TableCell key={w.id} className="text-center">
                        {cell ? (
                          <StockHealth
                            variant="cell"
                            onHand={cell.available}
                            reorderPoint={row.reorderPoint}
                            className="mx-auto"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right tabular font-medium">
                    {row.totalAvailable.toLocaleString("en-CA")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.health === "out_of_stock"
                          ? "danger"
                          : row.health === "low_stock"
                            ? "warning"
                            : "success"
                      }
                    >
                      {row.health === "out_of_stock"
                        ? "Out"
                        : row.health === "low_stock"
                          ? "Low"
                          : "OK"}
                    </Badge>
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

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warning" | "danger";
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p
        className={`font-display text-xl font-semibold tabular ${
          tone === "warning"
            ? "text-[var(--warning)]"
            : tone === "danger"
              ? "text-[var(--danger)]"
              : "text-[var(--foreground)]"
        }`}
      >
        {value.toLocaleString("en-CA")}
      </p>
    </div>
  );
}
