"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  getB2BCustomers,
  LAKESHORE_CUSTOMER_ID,
} from "@westwinds/data";
import {
  Badge,
  Money,
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

export default function B2BCustomersPage() {
  const customersQ = useQuery({
    queryKey: ["b2b-customers"],
    queryFn: () => getB2BCustomers(),
  });

  const customers = [...(customersQ.data ?? [])].sort((a, b) => {
    if (a.id === LAKESHORE_CUSTOMER_ID) return -1;
    if (b.id === LAKESHORE_CUSTOMER_ID) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="B2B accounts"
        description="Wholesale buyers on Westwinds Trade."
      />
      {customersQ.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Terms</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/customers/b2b/${c.id}`}
                      className="font-medium hover:text-[var(--primary)]"
                    >
                      {c.name}
                    </Link>
                    {c.id === LAKESHORE_CUSTOMER_ID ? (
                      <Badge variant="soft" className="ml-2">
                        Demo
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {c.locations[0]
                      ? `${c.locations[0].city}, ${c.locations[0].province}`
                      : "—"}
                  </TableCell>
                  <TableCell>{c.terms}</TableCell>
                  <TableCell className="text-right">
                    <Money amount={c.creditLimit} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={c.balance} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
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
