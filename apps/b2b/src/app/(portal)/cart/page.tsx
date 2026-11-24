"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getStockLevels } from "@calgarywholesale/data";
import {
  Button,
  EmptyState,
  Money,
  PageHeader,
  QuantityStepper,
  SectionCard,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { orderTotals, tierSavingsNote } from "@/lib/pricing";
import { brand } from "@calgarywholesale/lib";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeLine = useCartStore((s) => s.removeLine);
  const { priceGroup } = useLakeshoreAccount();

  const productsQuery = useQuery({
    queryKey: ["products-b2b-all"],
    queryFn: () => getProducts({ channel: "b2b", status: "active" }),
  });
  const stockQuery = useQuery({
    queryKey: ["stock-levels"],
    queryFn: () => getStockLevels(),
  });

  const byId = new Map((productsQuery.data ?? []).map((p) => [p.id, p]));
  const availByProduct = new Map<string, number>();
  for (const s of stockQuery.data ?? []) {
    availByProduct.set(
      s.productId,
      (availByProduct.get(s.productId) ?? 0) + s.available,
    );
  }

  const subtotal =
    Math.round(lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0) * 100) /
    100;
  const totals = orderTotals(subtotal);

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cart"
        description={`${lines.length} line${lines.length === 1 ? "" : "s"} · case quantities`}
        actions={
          lines.length > 0 ? (
            <Button asChild>
              <Link href="/checkout">Checkout</Link>
            </Button>
          ) : null
        }
      />

      {lines.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Cart is empty"
          message="Browse the catalog or open a saved list to start an order."
          action={
            <Button asChild>
              <Link href="/catalog">Browse catalog</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Case price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Line</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => {
                  const product = byId.get(line.productId);
                  const available = availByProduct.get(line.productId) ?? 0;
                  const low = line.qty > available;
                  const note = product
                    ? tierSavingsNote(product, line.qty, priceGroup)
                    : null;
                  return (
                    <TableRow key={line.productId}>
                      <TableCell>
                        <Link
                          href={`/catalog/${line.sku}`}
                          className="font-medium hover:text-[var(--primary)]"
                        >
                          {line.name}
                        </Link>
                        <p className="font-mono text-xs text-[var(--muted-foreground)]">
                          {line.sku}
                        </p>
                        {note ? (
                          <p className="text-xs text-[var(--success)]">{note}</p>
                        ) : null}
                        {low ? (
                          <p className="text-xs text-[var(--warning)]">
                            Only {available} cases available across warehouses
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right">
                        <Money amount={line.unitPrice} />
                      </TableCell>
                      <TableCell>
                        <QuantityStepper
                          value={line.qty}
                          min={1}
                          onChange={(v) => updateQty(line.productId, v)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Money
                          amount={
                            Math.round(line.qty * line.unitPrice * 100) / 100
                          }
                          className="font-medium"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeLine(line.productId)}
                          aria-label="Remove"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <SectionCard title="Summary">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
                <dd>
                  <Money amount={totals.subtotal} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted-foreground)]">
                  {brand.taxLabel} ({Math.round(brand.taxRate * 100)}%)
                </dt>
                <dd>
                  <Money amount={totals.taxAmount} />
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>
                  <Money amount={totals.total} />
                </dd>
              </div>
            </dl>
            <Button asChild className="mt-4 w-full">
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
