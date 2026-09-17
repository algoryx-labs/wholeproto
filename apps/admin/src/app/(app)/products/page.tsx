"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  categoryById,
  getProducts,
  getStockLevels,
  getWarehouses,
} from "@westwinds/data";
import {
  Badge,
  Money,
  PageHeader,
  ProductImage,
  Skeleton,
  StatusBadge,
  StockHealth,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";
import { useProductStore } from "@/stores/product-store";
import { useInventoryStore, stockKey } from "@/stores/inventory-store";

export default function ProductsPage() {
  const overlays = useProductStore((s) => s.overlays);
  const stockOverrides = useInventoryStore((s) => s.stockOverrides);

  const productsQ = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const stockQ = useQuery({
    queryKey: ["stock-levels"],
    queryFn: () => getStockLevels(),
  });

  const warehouses = warehousesQ.data ?? [];
  const products = productsQ.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Catalog shared by Westwinds Trade and the consumer app."
      />

      {productsQ.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">B2B case</TableHead>
                <TableHead className="text-right">App unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => {
                const ov = overlays[p.id] ?? {};
                const name = ov.name ?? p.name;
                const b2b = ov.b2bCasePrice ?? p.b2bCasePrice;
                const b2c = ov.b2cPrice ?? p.b2cPrice;
                const visibleOnB2B = ov.visibleOnB2B ?? p.visibleOnB2B;
                const visibleOnMobile = ov.visibleOnMobile ?? p.visibleOnMobile;
                const status = ov.status ?? p.status;
                const category = categoryById[p.categoryId]?.name ?? "Pantry";
                const whStock = warehouses.map((w) => {
                  const base = stockQ.data?.find(
                    (s) => s.productId === p.id && s.warehouseId === w.id,
                  );
                  const cell =
                    stockOverrides[stockKey(p.id, w.id)] ?? base;
                  return {
                    warehouseId: w.id,
                    warehouseCode: w.code,
                    onHand: cell?.available ?? 0,
                    reorderPoint: p.reorderPoint,
                  };
                });
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link
                        href={`/products/${p.id}`}
                        className="flex items-center gap-3 hover:text-[var(--primary)]"
                      >
                        <ProductImage
                          category={category}
                          name={name}
                          size="sm"
                        />
                        <span className="font-medium">{name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="tabular text-[var(--muted-foreground)]">
                      {p.sku}
                    </TableCell>
                    <TableCell className="text-right">
                      <Money amount={b2b} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Money amount={b2c} />
                    </TableCell>
                    <TableCell>
                      <StockHealth variant="dots" warehouses={whStock} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {visibleOnB2B ? (
                          <Badge variant="info">B2B</Badge>
                        ) : null}
                        {visibleOnMobile ? (
                          <Badge variant="soft">App</Badge>
                        ) : null}
                      </div>
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
