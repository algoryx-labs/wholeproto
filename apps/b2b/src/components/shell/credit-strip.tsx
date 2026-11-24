"use client";

import Link from "next/link";
import { Money, Skeleton } from "@calgarywholesale/ui";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";

export function CreditStrip() {
  const { customer, priceGroup, isLoading } = useLakeshoreAccount();
  const { credit, summary } = useLakeshoreBilling();

  if (isLoading) {
    return (
      <div className="border-t border-[var(--border)] bg-[var(--surface-sunken)]/60 px-4 py-1.5 lg:px-6">
        <Skeleton className="mx-auto h-4 max-w-[1400px]" />
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--border)] bg-[var(--surface-sunken)]/70">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-xs text-[var(--muted-foreground)] lg:px-6">
        <span>
          Price group:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {priceGroup?.name ?? "Standard"}
          </span>
          {priceGroup && priceGroup.discountPct > 0 ? (
            <span> · {priceGroup.discountPct}% off list</span>
          ) : null}
        </span>
        <span className="hidden text-[var(--border)] sm:inline">|</span>
        <span>
          Available credit:{" "}
          <Money
            amount={credit.available}
            className="font-medium text-[var(--foreground)]"
          />
          <span className="text-[var(--subtle-foreground)]">
            {" "}
            of <Money amount={credit.limit} />
          </span>
        </span>
        <span className="hidden text-[var(--border)] sm:inline">|</span>
        <span>
          Terms:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {customer.terms}
          </span>
        </span>
        {summary.overdue > 0 ? (
          <Link
            href="/billing"
            className="ml-auto font-medium text-[var(--danger)] hover:underline"
          >
            <Money amount={summary.overdue} /> overdue · pay now
          </Link>
        ) : null}
      </div>
    </div>
  );
}
