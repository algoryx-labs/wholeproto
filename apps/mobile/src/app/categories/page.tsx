"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mic, Search } from "lucide-react";
import { getCategories, getProducts, type Product } from "@westwinds/data";
import { CATEGORY_TINTS, ProductImage, Skeleton } from "@westwinds/ui";
import { productImageSrc } from "@/lib/product-image";

export default function CategoriesPage() {
  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const productsQ = useQuery({
    queryKey: ["products", "mobile"],
    queryFn: () => getProducts({ channel: "mobile", status: "active" }),
  });

  const productsByCat = React.useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of productsQ.data ?? []) {
      (map[p.categoryId] ??= []).push(p);
    }
    return map;
  }, [productsQ.data]);

  const all = catsQ.data ?? [];
  const groups = [
    { title: "Kitchen & packaging", cats: all.slice(0, 8) },
    { title: "Service & ops", cats: all.slice(4) },
  ];

  return (
    <div className="space-y-5 bg-white pb-4 pt-2">
      <div className="space-y-3 px-4">
        <h1 className="text-[22px] font-bold tracking-[-0.03em]">Categories</h1>
        <Link
          href="/search"
          className="flex h-11 items-center gap-2.5 rounded-full border border-[var(--border)] bg-white px-3.5 text-[var(--muted-foreground)] active:scale-[0.99]"
        >
          <Search className="size-[18px] text-[var(--foreground)]" />
          <span className="min-w-0 flex-1 truncate text-[14px]">
            Search for bags, cups, boxes and more
          </span>
          <Mic className="size-[18px] text-[var(--subtle-foreground)]" />
        </Link>
      </div>

      {catsQ.isLoading
        ? (
          <div className="grid grid-cols-4 gap-3 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded-[var(--radius-md)]"
              />
            ))}
          </div>
        )
        : groups.map((group) =>
            group.cats.length === 0 ? null : (
              <section key={group.title} className="space-y-3 px-4">
                <h2 className="text-[17px] font-bold tracking-[-0.02em]">
                  {group.title}
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {group.cats.map((c) => {
                    const sample = productsByCat[c.id]?.[0];
                    return (
                      <Link
                        key={c.id}
                        href={`/categories/${c.slug}`}
                        className="flex flex-col items-center gap-1.5 active:scale-[0.97]"
                      >
                        <div
                          className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[var(--radius-md)]"
                          style={{
                            backgroundColor:
                              CATEGORY_TINTS[c.name] ?? "#EEF3FF",
                          }}
                        >
                          {sample ? (
                            <ProductImage
                              src={productImageSrc(sample.sku)}
                              category={c.name}
                              name={sample.name}
                              size="md"
                              className="h-[72%] w-[72%] rounded-md bg-transparent"
                            />
                          ) : (
                            <span className="text-xl font-bold text-[var(--primary)]">
                              {c.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-2 min-h-[2rem] text-center text-[11px] font-medium leading-tight">
                          {c.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ),
          )}
    </div>
  );
}
