"use client";

import { useQuery } from "@tanstack/react-query";
import { getPriceGroups } from "@westwinds/data";
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

export default function PricingPage() {
  const q = useQuery({
    queryKey: ["price-groups"],
    queryFn: () => getPriceGroups(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing"
        description="Price groups applied to B2B Trade accounts."
      />
      {q.isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(q.data ?? []).map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="tabular">{g.discountPct}%</TableCell>
                  <TableCell className="text-[var(--muted-foreground)]">
                    {g.description}
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
