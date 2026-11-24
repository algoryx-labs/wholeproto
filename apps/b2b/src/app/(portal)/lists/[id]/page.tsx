"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProducts } from "@calgarywholesale/data";
import { formatDate } from "@calgarywholesale/lib";
import {
  Button,
  EmptyState,
  Money,
  PageHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { casePriceForProduct } from "@/lib/pricing";
import { getSavedList } from "@/lib/saved-lists";
import { useCartStore } from "@/stores/cart-store";

export default function ListDetailPage() {
  const params = useParams<{ id: string }>();
  const list = getSavedList(params.id);
  const addLine = useCartStore((s) => s.addLine);
  const { priceGroup } = useLakeshoreAccount();

  const productsQuery = useQuery({
    queryKey: ["products-b2b-all"],
    queryFn: () => getProducts({ channel: "b2b", status: "active" }),
  });

  if (!list) {
    return (
      <EmptyState
        title="List not found"
        message="That saved list is not available in this demo."
        action={
          <Button asChild variant="outline">
            <Link href="/lists">Back to lists</Link>
          </Button>
        }
      />
    );
  }

  const bySku = new Map(
    (productsQuery.data ?? []).map((p) => [p.sku, p] as const),
  );

  const addAll = () => {
    let count = 0;
    for (const item of list.items) {
      const product = bySku.get(item.sku);
      if (!product) continue;
      addLine({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        qty: item.qty,
        unitPrice: casePriceForProduct(product, priceGroup, item.qty),
      });
      count += 1;
    }
    toast.success(`Added ${count} products from ${list.name}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={list.name}
        description={`${list.description} · Updated ${formatDate(list.updatedAt)}`}
        breadcrumbs={[
          { label: "Order lists", href: "/lists" },
          { label: list.name },
        ]}
        actions={
          <Button type="button" onClick={addAll} disabled={productsQuery.isLoading}>
            Add list to cart
          </Button>
        }
      />

      {productsQuery.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty (cases)</TableHead>
                <TableHead className="text-right">Case price</TableHead>
                <TableHead className="text-right">Line</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.items.map((item) => {
                const product = bySku.get(item.sku);
                const price = product
                  ? casePriceForProduct(product, priceGroup, item.qty)
                  : 0;
                return (
                  <TableRow key={item.sku}>
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell>
                      {product ? (
                        <Link
                          href={`/catalog/${product.sku}`}
                          className="hover:text-[var(--primary)]"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <span className="text-[var(--danger)]">Missing SKU</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular">{item.qty}</TableCell>
                    <TableCell className="text-right">
                      {product ? <Money amount={price} /> : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {product ? <Money amount={price * item.qty} className="font-medium" /> : "—"}
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
