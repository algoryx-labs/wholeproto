"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTransfers, getWarehouses, warehouseById } from "@calgarywholesale/data";
import { formatDate } from "@calgarywholesale/lib";
import {
  Badge,
  Button,
  PageHeader,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";
import { useInventoryStore } from "@/stores/inventory-store";

export default function TransfersPage() {
  const localTransfers = useInventoryStore((s) => s.localTransfers);
  const transferOverrides = useInventoryStore((s) => s.transferOverrides);

  const transfersQ = useQuery({
    queryKey: ["transfers"],
    queryFn: () => getTransfers(),
  });
  const warehousesQ = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const seed = transfersQ.data ?? [];
  const merged = [
    ...localTransfers,
    ...seed.filter((t) => !localTransfers.some((l) => l.id === t.id)),
  ].map((t) => ({ ...t, ...transferOverrides[t.id] }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfers"
        description="Move stock between Ontario warehouses."
        actions={
          <Button asChild>
            <Link href="/transfers/new">New transfer</Link>
          </Button>
        }
      />

      {!warehousesQ.data && transfersQ.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Lines</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merged.map((t) => {
                const from = warehouseById[t.fromWarehouseId];
                const to = warehouseById[t.toWarehouseId];
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Link
                        href={`/transfers/${t.id}`}
                        className="font-medium tabular text-[var(--primary)] hover:underline"
                      >
                        {t.number}
                      </Link>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t.requestedBy}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary">{from?.code ?? "?"}</Badge>
                        <span className="text-[var(--muted-foreground)]">→</span>
                        <Badge variant="soft">{to?.code ?? "?"}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="tabular">{t.lines.length}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(t.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(t.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
