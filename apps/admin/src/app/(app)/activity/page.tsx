"use client";

import { useQuery } from "@tanstack/react-query";
import { getActivity } from "@westwinds/data";
import { formatDate } from "@westwinds/lib";
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

export default function ActivityPage() {
  const q = useQuery({
    queryKey: ["activity", 100],
    queryFn: () => getActivity(100),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity log"
        description="Recent staff actions across orders, inventory, and catalog."
      />
      {q.isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(q.data ?? []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDate(e.createdAt)}
                  </TableCell>
                  <TableCell>{e.actorName}</TableCell>
                  <TableCell className="font-medium">{e.action}</TableCell>
                  <TableCell className="text-[var(--muted-foreground)]">
                    {e.entityLabel}
                    {e.detail ? ` · ${e.detail}` : ""}
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
