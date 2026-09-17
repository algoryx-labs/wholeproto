"use client";

import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
import {
  Badge,
  PageHeader,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function PromotionsPage() {
  const q = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotions"
        description="Codes and offers for Trade and the consumer app."
      />
      {q.isLoading ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(q.data ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium tabular">{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.channel}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--muted-foreground)]">
                    {formatDate(p.startsAt)} – {formatDate(p.endsAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={p.active ? "active" : "inactive"}
                    />
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
