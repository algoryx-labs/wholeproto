"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getB2BCustomer,
  getOrders,
  getPriceGroups,
  LAKESHORE_CUSTOMER_ID,
} from "@westwinds/data";
import { formatCurrency, formatDate } from "@westwinds/lib";
import {
  Badge,
  KeyValueList,
  Money,
  PageHeader,
  SectionCard,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function B2BCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const customerQ = useQuery({
    queryKey: ["b2b-customer", id],
    queryFn: () => getB2BCustomer(id),
  });
  const ordersQ = useQuery({
    queryKey: ["orders", "customer", id],
    queryFn: () => getOrders({ customerId: id }),
  });
  const priceGroupsQ = useQuery({
    queryKey: ["price-groups"],
    queryFn: () => getPriceGroups(),
  });

  const customer = customerQ.data;
  if (customerQ.isLoading) return <Skeleton className="h-64 w-full" />;
  if (!customer) {
    return (
      <PageHeader title="Account not found" description={`No account ${id}.`} />
    );
  }

  const priceGroup = priceGroupsQ.data?.find(
    (g) => g.id === customer.priceGroupId,
  );
  const primary = customer.locations[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={`Account ${customer.accountNumber}`}
        breadcrumbs={[
          { label: "B2B accounts", href: "/customers/b2b" },
          { label: customer.name },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={customer.status} />
        {customer.id === LAKESHORE_CUSTOMER_ID ? (
          <Badge variant="soft">Demo account</Badge>
        ) : null}
        {priceGroup ? <Badge variant="info">{priceGroup.name}</Badge> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Overview">
          <KeyValueList
            items={[
              {
                key: "terms",
                label: "Payment terms",
                value: customer.terms,
              },
              {
                key: "credit",
                label: "Credit limit",
                value: formatCurrency(customer.creditLimit),
              },
              {
                key: "balance",
                label: "Balance",
                value: formatCurrency(customer.balance),
              },
              {
                key: "hst",
                label: "HST number",
                value: customer.hstNumber,
              },
              {
                key: "address",
                label: "Primary location",
                value: primary
                  ? `${primary.line1}, ${primary.city}, ${primary.province} ${primary.postalCode}`
                  : "—",
              },
            ]}
          />
        </SectionCard>

        <SectionCard title="Team">
          <ul className="space-y-2">
            {customer.users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {u.email}
                  </p>
                </div>
                <Badge variant="secondary">{u.role.replace(/_/g, " ")}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Recent orders">
        {ordersQ.isLoading ? (
          <Skeleton className="h-32" />
        ) : (ordersQ.data ?? []).length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            No orders yet for this account.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(ordersQ.data ?? []).slice(0, 8).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="tabular font-medium">
                    {o.number}
                  </TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Money amount={o.total} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
