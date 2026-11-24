"use client";

import { useQuery } from "@tanstack/react-query";
import { getConsumers } from "@calgarywholesale/data";
import { formatDate } from "@calgarywholesale/lib";
import {
  PageHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@calgarywholesale/ui";

export default function AppCustomersPage() {
  const consumersQ = useQuery({
    queryKey: ["consumers"],
    queryFn: () => getConsumers(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="App customers"
        description="Consumers ordering through the mobile app."
      />
      {consumersQ.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(consumersQ.data ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell className="tabular">{c.phone}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                  <TableCell>
                    {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
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
