"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getB2BCustomer,
  getPriceGroups,
  LAKESHORE_CUSTOMER_ID,
} from "@westwinds/data";
import { Money, Skeleton } from "@westwinds/ui";

export function CreditStrip() {
  const { data: customer, isLoading } = useQuery({
    queryKey: ["b2b-customer", LAKESHORE_CUSTOMER_ID],
    queryFn: () => getB2BCustomer(LAKESHORE_CUSTOMER_ID),
  });
  const { data: groups } = useQuery({
    queryKey: ["price-groups"],
    queryFn: () => getPriceGroups(),
  });

  if (isLoading || !customer) {
    return (
      <div className="border-t border-[var(--border)] bg-[var(--surface-sunken)]/60 px-4 py-1.5 lg:px-6">
        <Skeleton className="mx-auto h-4 max-w-[1400px]" />
      </div>
    );
  }

  const group = groups?.find((g) => g.id === customer.priceGroupId);
  const available = Math.max(0, customer.creditLimit - customer.balance);

  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface-sunken)]/70">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-xs text-[var(--muted-foreground)] lg:px-6">
        <span>
          Price group:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {group?.name ?? "Standard"}
          </span>
          {group && group.discountPct > 0 ? (
            <span> · {group.discountPct}% off list</span>
          ) : null}
        </span>
        <span className="hidden text-[var(--border)] sm:inline">|</span>
        <span>
          Available credit:{" "}
          <Money
            amount={available}
            className="font-medium text-[var(--foreground)]"
          />
          <span className="text-[var(--subtle-foreground)]">
            {" "}
            of <Money amount={customer.creditLimit} />
          </span>
        </span>
        <span className="hidden text-[var(--border)] sm:inline">|</span>
        <span>
          Terms:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {customer.terms}
          </span>
        </span>
      </div>
    </div>
  );
}
