"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  categoryById,
  getCategories,
  getProducts,
  getStockLevels,
  getWarehouses,
  type Product,
} from "@westwinds/data";
import { cn } from "@westwinds/lib";
import {
  Button,
  FilterBar,
  Money,
  PageHeader,
  ProductImage,
  QuantityStepper,
  Skeleton,
  StockHealth,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";
import { LayoutGrid, TableIcon } from "lucide-react";
import { useLiveStock } from "@/hooks/use-live-stock";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { casePriceForProduct } from "@/lib/pricing";
import { useCartStore } from "@/stores/cart-store";

export default function CatalogPage() {
  const [categoryId, setCategoryId] = React.useState<string | undefined>();
  const [search, setSearch] = React.useState("");
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [qtyById, setQtyById] = React.useState<Record<string, number>>({});
  const addLine = useCartStore((s) => s.addLine);
  const { priceGroup } = useLakeshoreAccount();

  const catsQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const productsQuery = useQuery({
    queryKey: ["products-b2b", categoryId, search],
    queryFn: () =>
      getProducts({
        channel: "b2b",
        status: "active",
        categoryId,
        search: search || undefined,
      }),
  });
  const stockQuery = useQuery({
    queryKey: ["stock-levels"],
    queryFn: () => getStockLevels(),
  });
  const whQuery = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const { getAvailable, isFlashed } = useLiveStock(stockQuery.data);
  const products = productsQuery.data ?? [];
  const warehouses = whQuery.data ?? [];

  const stockByProduct = React.useMemo(() => {
    const map = new Map<string, typeof stockQuery.data>();
    for (const level of stockQuery.data ?? []) {
      const list = map.get(level.productId) ?? [];
      list.push(level);
      map.set(level.productId, list);
    }
    return map;
  }, [stockQuery.data]);

  const addProduct = (product: Product) => {
    const qty = qtyById[product.id] ?? 1;
    const unitPrice = casePriceForProduct(product, priceGroup, qty);
    addLine({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      qty,
      unitPrice,
    });
    toast.success(`Added ${qty} case${qty === 1 ? "" : "s"} of ${product.name}`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Catalog"
        description="Case pricing with live warehouse availability across Calgary."
        actions={
          <div className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] p-0.5">
            <Button
              type="button"
              size="sm"
              variant={view === "table" ? "secondary" : "ghost"}
              onClick={() => setView("table")}
            >
              <TableIcon className="size-3.5" />
              Table
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "grid" ? "secondary" : "ghost"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="size-3.5" />
              Grid
            </Button>
          </div>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search catalog…"
        onClear={() => {
          setSearch("");
          setCategoryId(undefined);
        }}
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        <aside className="w-full shrink-0 space-y-1 lg:w-48">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            Categories
          </p>
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={cn(
              "block w-full rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left text-sm",
              !categoryId
                ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--surface-sunken)]",
            )}
          >
            All products
          </button>
          {(catsQuery.data ?? []).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={cn(
                "block w-full rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left text-sm",
                categoryId === cat.id
                  ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface-sunken)]",
              )}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        <div className="min-w-0 flex-1">
          {productsQuery.isLoading || stockQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const cat = categoryById[product.categoryId];
                const price = casePriceForProduct(product, priceGroup, 1);
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 transition-colors",
                      isFlashed(product.id) && "bg-[var(--offer-soft)]",
                    )}
                  >
                    <Link href={`/catalog/${product.sku}`} className="flex gap-3">
                      <ProductImage category={cat?.name} name={product.name} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{product.sku}</p>
                        <Money amount={price} className="mt-1 text-sm font-semibold" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12" />
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Pack</TableHead>
                    <TableHead className="text-right">Case price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="w-[200px]">Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const cat = categoryById[product.categoryId];
                    const levels = stockByProduct.get(product.id) ?? [];
                    const qty = qtyById[product.id] ?? 1;
                    const price = casePriceForProduct(product, priceGroup, qty);
                    const dots = warehouses.map((w) => {
                      const level = levels.find((l) => l.warehouseId === w.id);
                      return {
                        warehouseCode: w.code,
                        onHand: level?.available ?? 0,
                        reorderPoint: level?.reorderPoint ?? product.reorderPoint,
                      };
                    });
                    return (
                      <TableRow
                        key={product.id}
                        className={cn(
                          "transition-colors",
                          isFlashed(product.id) && "bg-[var(--offer-soft)]",
                        )}
                      >
                        <TableCell>
                          <ProductImage
                            size="sm"
                            category={cat?.name}
                            name={product.name}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/catalog/${product.sku}`}
                            className="font-medium hover:text-[var(--primary)]"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {product.brand} · avail {getAvailable(product.id)} cs
                          </p>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="text-sm text-[var(--muted-foreground)]">
                          {product.casePack}
                        </TableCell>
                        <TableCell className="text-right">
                          <Money amount={price} className="font-medium" />
                        </TableCell>
                        <TableCell>
                          <StockHealth variant="dots" warehouses={dots} unit="cs" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <QuantityStepper
                              value={qty}
                              min={1}
                              onChange={(v) =>
                                setQtyById((m) => ({ ...m, [product.id]: v }))
                              }
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addProduct(product)}
                            >
                              Add
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
