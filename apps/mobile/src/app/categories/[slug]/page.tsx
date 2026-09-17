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
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <Link
          href="/categories"
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
          {category?.name ?? "Category"}
        </h1>
      </div>

      {productsQ.isLoading || catsQ.isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-[var(--radius-lg)]" />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={productsQ.data ?? []}
          categoryById={catNameById}
        />
      )}
    </div>
  );
}