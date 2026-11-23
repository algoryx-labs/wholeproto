"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { getCategories, getProducts } from "@westwinds/data";
import { Skeleton } from "@westwinds/ui";
import { ProductGrid } from "@/components/product-card";

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const category = (catsQ.data ?? []).find((c) => c.slug === slug);

  const productsQ = useQuery({
    queryKey: ["products", "mobile", category?.id],
    queryFn: () =>
      getProducts({
        channel: "mobile",
        status: "active",
        categoryId: category!.id,
      }),
    enabled: Boolean(category?.id),
  });

  const catNameById = Object.fromEntries(
    (catsQ.data ?? []).map((c) => [c.id, c.name]),
  );

  return (
    <div className="space-y-4 bg-white px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <Link
          href="/categories"
          className="flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-[20px] font-bold tracking-[-0.03em]">
            {category?.name ?? "Category"}
          </h1>
          {category ? (
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {category.description}
            </p>
          ) : null}
        </div>
      </div>

      {productsQ.isLoading || catsQ.isLoading ? (
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-[var(--radius-md)]" />
          ))}
        </div>
      ) : (productsQ.data ?? []).length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
          No products in this category yet.
        </p>
      ) : (
        <ProductGrid
          products={productsQ.data ?? []}
          categoryById={catNameById}
          columns={3}
        />
      )}
    </div>
  );
}