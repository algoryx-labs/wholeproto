"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  getProduct,
  getStockLevels,
  getWarehouses,
  stockMovements,
  warehouseById,
} from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  ProductImage,
  Qty,
  SectionCard,
  Skeleton,
  StockHealth,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";
import { useInventoryStore, stockKey } from "@/stores/inventory-store";

export default function InventorySkuPage() {
  const params = useParams<{ sku: string }>();
  const sku = decodeURIComponent(params.sku);
  const overrides = useInventoryStore((s) => s.stockOverrides);

  const productQ = useQuery({
    queryKey: ["product", sku],
    queryFn: () => getProduct(sku),
  });
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });
  const stockQ = useQuery({
    queryKey: ["stock-levels", productQ.data?.id],
    queryFn: () => getStockLevels({ productId: productQ.data!.id }),
    enabled: Boolean(productQ.data?.id),
  });

  const product = productQ.data;
  const levels = (stockQ.data ?? []).map((s) => {
    const ov = overrides[stockKey(s.productId, s.warehouseId)];
    return ov ? { ...s, ...ov } : s;
  });
  const movements = product
    ? stockMovements
        .filter((m) => m.productId === product.id)
        .slice(0, 12)
    : [];

  if (productQ.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <PageHeader
        title="Product not found"
        description={`No inventory record for SKU ${sku}.`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`${product.sku} · ${product.brand} · ROP ${product.reorderPoint}`}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: product.sku },
        ]}
      />

      <div className="flex flex-wrap items-start gap-4">
        <ProductImage
          category="Produce"
          name={product.name}
          alt={product.name}
          size="lg"
        />
        <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
          <p>
            Case pack {product.casePack} · Unit {product.unitSize}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.visibleOnB2B ? <Badge variant="info">B2B</Badge> : null}
            {product.visibleOnMobile ? <Badge variant="soft">App</Badge> : null}
            <Badge variant="secondary">{product.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(warehousesQ.data ?? []).map((w) => {
          const level = levels.find((l) => l.warehouseId === w.id);
          return (
            <Card key={w.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {w.code}
                  <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
                    {w.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {level ? (
                  <>
                    <StockHealth
                      variant="bar"
                      onHand={level.available}
                      reorderPoint={product.reorderPoint}
                    />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      On hand <Qty value={level.onHand} showUnit={false} /> ·
                      Allocated <Qty value={level.allocated} showUnit={false} />{" "}
                      · Bin {level.binLocation}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No stock record
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SectionCard title="Recent movements">
        {movements.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            No recent movements for this SKU.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="text-sm">
                    {formatDate(m.createdAt)}
                  </TableCell>
                  <TableCell>
                    {warehouseById[m.warehouseId]?.code ?? m.warehouseId}
                  </TableCell>
                  <TableCell className="capitalize">
                    {m.type.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {m.quantity > 0 ? "+" : ""}
                    {m.quantity}
                  </TableCell>
                  <TableCell className="text-[var(--muted-foreground)]">
                    {m.createdBy}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
