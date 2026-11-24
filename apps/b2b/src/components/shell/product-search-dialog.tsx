"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@calgarywholesale/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ProductImage,
  Skeleton,
} from "@calgarywholesale/ui";
import { categoryById } from "@calgarywholesale/data";

export function ProductSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [q, setQ] = React.useState("");
  const { data: products, isLoading } = useQuery({
    queryKey: ["products-b2b-search"],
    queryFn: () => getProducts({ channel: "b2b", status: "active" }),
    enabled: open,
  });

  const results = React.useMemo(() => {
    if (!products) return [];
    const query = q.trim().toLowerCase();
    if (!query) return products.slice(0, 8);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query),
      )
      .slice(0, 12);
  }, [products, q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-[var(--border)] px-4 py-3">
          <DialogTitle className="text-base">Find products</DialogTitle>
        </DialogHeader>
        <div className="p-3">
          <Input
            autoFocus
            placeholder="Search by name, SKU, or brand…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="max-h-80 overflow-y-auto px-2 pb-3">
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">
              No products match “{q}”.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((p) => {
                const cat = categoryById[p.categoryId];
                return (
                  <li key={p.id}>
                    <Link
                      href={`/catalog/${p.sku}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 hover:bg-[var(--primary-soft)]"
                    >
                      <ProductImage
                        size="sm"
                        category={cat?.name}
                        name={p.name}
                        alt={p.name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="truncate text-xs text-[var(--muted-foreground)]">
                          {p.sku} · {p.casePack}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
