"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@westwinds/data";
import { formatCurrency, cn } from "@westwinds/lib";
import { ProductImage } from "@westwinds/ui";
import { useCartStore } from "@/stores/cart";
import { productImageSrc } from "@/lib/product-image";

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  const qty = useCartStore((s) => s.getQty(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
      <Link href={`/product/${product.sku}`} className="active:scale-[0.98]">
        <ProductImage
          src={productImageSrc(product.sku)}
          category={categoryName}
          name={product.name}
          size="lg"
          className="h-28 w-full rounded-[var(--radius-md)]"
        />
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug">
          {product.name}
        </p>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          {product.unitSize}
        </p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="font-semibold tabular text-[var(--foreground)]">
            {formatCurrency(product.b2cPrice)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-xs text-[var(--subtle-foreground)] line-through tabular">
              {formatCurrency(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </Link>

      {qty === 0 ? (
        <button
          type="button"
          onClick={() =>
            addItem({
              productId: product.id,
              sku: product.sku,
              name: product.name,
              unitPrice: product.b2cPrice,
              categoryName,
              imageHint: product.imageHint,
              imageSrc: productImageSrc(product.sku),
            })
          }
          className="mt-auto flex h-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--primary)] text-sm font-semibold text-[var(--primary)] active:scale-[0.98]"
        >
          Add
        </button>
      ) : (
        <div className="mt-auto flex h-11 items-center justify-between rounded-[var(--radius-sm)] bg-[var(--primary)] px-1 text-[var(--primary-foreground)]">
          <button
            type="button"
            aria-label="Decrease"
            className="flex size-10 items-center justify-center active:scale-[0.98]"
            onClick={() => setQty(product.id, qty - 1)}
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold tabular">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase"
            className="flex size-10 items-center justify-center active:scale-[0.98]"
            onClick={() => setQty(product.id, qty + 1)}
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductRail({
  title,
  products,
  categoryById,
}: {
  title: string;
  products: Product[];
  categoryById: Record<string, string>;
}) {
  return (
    <section className="space-y-3">
      <h2 className="px-4 font-display text-lg font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[148px] shrink-0">
            <ProductCard
              product={p}
              categoryName={categoryById[p.categoryId] ?? "Pantry"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductGrid({
  products,
  categoryById,
  className,
}: {
  products: Product[];
  categoryById: Record<string, string>;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          categoryName={categoryById[p.categoryId] ?? "Pantry"}
        />
      ))}
    </div>
  );
}