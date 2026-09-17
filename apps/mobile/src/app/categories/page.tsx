"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@westwinds/data";
import { CATEGORY_TINTS, Skeleton } from "@westwinds/ui";

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <h1 className="font-display text-2xl font-semibold tracking-[-0.03em]">
        Categories
      </h1>
      <div className="grid grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[var(--radius-lg)]" />
            ))
          : (data ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="flex flex-col justify-between rounded-[var(--radius-lg)] p-4 active:scale-[0.98]"
                style={{
                  backgroundColor: CATEGORY_TINTS[c.name] ?? "#EEF2EF",
                  minHeight: 112,
                }}
              >
                <span className="font-display text-lg font-semibold tracking-[-0.02em]">
                  {c.name}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {c.description.slice(0, 48)}…
                </span>
              </Link>
            ))}
      </div>
    </div>
  );
}