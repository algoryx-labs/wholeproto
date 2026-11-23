"use client";

import Link from "next/link";
import { Heart, Minus, Plus, Timer } from "lucide-react";
import type { Product } from "@westwinds/data";
import { formatCurrency, cn } from "@westwinds/lib";
import { ProductImage } from "@westwinds/ui";
import { useCartStore } from "@/stores/cart";
import { productImageSrc } from "@/lib/product-image";

function discountPct(product: Product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.b2cPrice) {
    return null;
  }
  return Math.round(
    ((product.compareAtPrice - product.b2cPrice) / product.compareAtPrice) * 100,
  );
}

export function ProductCard({
  product,
  categoryName,
  compact = false,
}: {
  product: Product;
  categoryName: string;
  compact?: boolean;
}) {
  const qty = useCartStore((s) => s.getQty(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);
  const off = discountPct(product);
  const tag = product.tags?.[0];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2",
        compact ? "gap-1.5" : "gap-2 p-2.5",
      )}
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Save"
          className="absolute right-1 top-1 z-10 flex size-7 items-center justify-center rounded-full bg-white/90 text-[var(--subtle-foreground)] shadow-sm"
        >
          <Heart className="size-3.5" />
        </button>
        {off ? (
          <span className="absolute left-1 top-1 z-10 rounded bg-[#FFF3C9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8A5A00]">
            Trending
          </span>
        ) : null}
        <Link href={`/product/${product.sku}`} className="block active:opacity-90">
          <ProductImage
            src={productImageSrc(product.sku)}
            category={categoryName}
            name={product.name}
            size="lg"
            className={cn(
              "w-full rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]",
              compact ? "h-[88px]" : "h-[110px]",
            )}
          />
        </Link>
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-[10px] text-[var(--muted-foreground)]">
          {product.unitSize}
        </span>
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
            className="h-7 shrink-0 rounded-md border-[1.5px] border-[var(--primary)] px-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--primary)] active:scale-[0.96]"
          >
            Add
          </button>
        ) : (
          <div className="flex h-7 shrink-0 items-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
            <button
              type="button"
              aria-label="Decrease"
              className="flex size-7 items-center justify-center active:scale-[0.96]"
              onClick={() => setQty(product.id, qty - 1)}
            >
              <Minus className="size-3" />
            </button>
            <span className="min-w-4 text-center text-[11px] font-bold tabular">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase"
              className="flex size-7 items-center justify-center active:scale-[0.96]"
              onClick={() => setQty(product.id, qty + 1)}
            >
              <Plus className="size-3" />
            </button>
          </div>
        )}
      </div>

      <Link href={`/product/${product.sku}`} className="space-y-0.5">
        <div className="flex flex-wrap items-baseline gap-1">
          <span className="text-[13px] font-bold tabular text-[var(--foreground)]">
            {formatCurrency(product.b2cPrice)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-[10px] text-[var(--subtle-foreground)] line-through tabular">
              {formatCurrency(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        {off ? (
          <p className="text-[10px] font-semibold text-[var(--accent)]">
            {off}% OFF
          </p>
        ) : null}
        <p className="line-clamp-2 text-[12px] font-medium leading-snug text-[var(--foreground)]">
          {product.name}
        </p>
        {tag ? (
          <span className="mt-0.5 inline-flex rounded-full bg-[#F5EFE4] px-1.5 py-0.5 text-[9px] font-medium text-[#7A5C2E]">
            {tag}
          </span>
        ) : null}
        <p className="flex items-center gap-1 pt-0.5 text-[10px] text-[var(--muted-foreground)]">
          <Timer className="size-3" />
          Same day
        </p>
      </Link>
    </div>
  );
}

export function ProductRail({
  title,
  subtitle,
  products,
  categoryById,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  categoryById: Record<string, string>;
}) {
  return (
    <section className="space-y-3">
      <div className="px-4">
        <h2 className="text-[17px] font-bold tracking-[-0.02em] text-[var(--foreground)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[132px] shrink-0">
            <ProductCard
              product={p}
              categoryName={categoryById[p.categoryId] ?? "Pantry"}
              compact
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
  columns = 3,
}: {
  products: Product[];
  categoryById: Record<string, string>;
  className?: string;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-2.5",
        columns === 3 ? "grid-cols-3" : "grid-cols-2",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          categoryName={categoryById[p.categoryId] ?? "Pantry"}
          compact={columns === 3}
        />
      ))}
    </div>
  );
}
