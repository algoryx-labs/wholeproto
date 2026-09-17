"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  categoryById,
  getProduct,
  getStockLevels,
  getWarehouses,
} from "@westwinds/data";
import {
  Button,
  Money,
  PageHeader,
  ProductImage,
  QuantityStepper,
  SectionCard,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { applyGroupDiscount, casePriceForProduct } from "@/lib/pricing";
import { useCartStore } from "@/stores/cart-store";

export default function ProductDetailPage() {
  const params = useParams<{ sku: string }>();
  const sku = decodeURIComponent(params.sku);
  const [qty, setQty] = React.useState(1);
  const addLine = useCartStore((s) => s.addLine);
  const { priceGroup } = useLakeshoreAccount();

  const productQuery = useQuery({
    queryKey: ["product", sku],
    queryFn: () => getProduct(sku),
  });
  const stockQuery = useQuery({
    queryKey: ["stock", productQuery.data?.id],
    queryFn: () => getStockLevels({ productId: productQuery.data!.id }),
    enabled: Boolean(productQuery.data?.id),
  });
  const whQuery = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const product = productQuery.data;
  const cat = product ? categoryById[product.categoryId] : undefined;
  const unitPrice = product
    ? casePriceForProduct(product, priceGroup, qty)
    : 0;

  const add = () => {
    if (!product) return;
    addLine({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      qty,
      unitPrice,
    });
    toast.success(`Added ${qty} case${qty === 1 ? "" : "s"} to cart`);
  };

  if (productQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <PageHeader title="Product not found" description={`No listing for ${sku}.`} />
        <Button asChild variant="outline">
          <Link href="/catalog">Back to catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`${product.brand} · ${product.sku}`}
        breadcrumbs={[
          { label: "Catalog", href: "/catalog" },
          { label: cat?.name ?? "Product" },
          { label: product.sku },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <ProductImage
          size="lg"
          category={cat?.name}
          name={product.name}
          className="h-40 w-full max-w-[240px]"
        />
        <div className="space-y-4">
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            {product.description}
          </p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted-foreground)]">Case pack</dt>
              <dd className="font-medium">{product.casePack}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">Unit size</dt>
              <dd className="font-medium">{product.unitSize}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">List case price</dt>
              <dd>
                <Money amount={product.b2bCasePrice} className="font-medium" />
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted-foreground)]">Your case price</dt>
              <dd>
                <Money amount={unitPrice} className="font-semibold text-[var(--primary)]" />
                {priceGroup && priceGroup.discountPct > 0 ? (
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                    {priceGroup.name} −{priceGroup.discountPct}%
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} min={1} onChange={setQty} />
            <Button type="button" onClick={add}>
              Add {qty} case{qty === 1 ? "" : "s"} · <Money amount={unitPrice * qty} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Volume tiers" description="Prices before your price-group discount">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cases</TableHead>
                <TableHead className="text-right">List / case</TableHead>
                <TableHead className="text-right">Your / case</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.tiers.map((tier) => (
                <TableRow key={`${tier.minCases}-${tier.maxCases}`}>
                  <TableCell>
                    {tier.minCases}
                    {tier.maxCases == null ? "+" : `–${tier.maxCases}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={tier.pricePerCase} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Money
                      amount={applyGroupDiscount(tier.pricePerCase, priceGroup)}
                      className="font-medium"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Availability" description="Cases available by warehouse">
          {stockQuery.isLoading || whQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">On hand</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(whQuery.data ?? []).map((w) => {
                  const level = (stockQuery.data ?? []).find(
                    (s) => s.warehouseId === w.id,
                  );
                  return (
                    <TableRow key={w.id}>
                      <TableCell>
                        <span className="font-medium">{w.code}</span>
                        <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                          {w.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular">
                        {level?.onHand ?? 0}
                      </TableCell>
                      <TableCell className="text-right tabular font-medium">
                        {level?.available ?? 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
