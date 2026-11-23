"use client";

import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";
import { getCategories } from "@westwinds/data";
import {
  PageHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function CategoriesPage() {
  const q = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Catalog taxonomy shared across Admin, Trade, and the app."
      />
      {q.isLoading ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(q.data ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Tags className="size-3.5 text-[var(--muted-foreground)]" />
                      {c.name}
                    </span>
                  </TableCell>
                  <TableCell className="tabular text-[var(--muted-foreground)]">
                    {c.slug}
                  </TableCell>
                  <TableCell className="max-w-md text-[var(--muted-foreground)]">
                    {c.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
