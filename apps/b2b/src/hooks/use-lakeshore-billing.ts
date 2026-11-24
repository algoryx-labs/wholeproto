"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { getInvoices, LAKESHORE_CUSTOMER_ID } from "@calgarywholesale/data";
import {
  agingBuckets,
  applyPayments,
  BILLING_TODAY,
  daysPastDue,
  isOpen,
  recordedPayments,
  round2,
} from "@/lib/billing";
import { useBillingStore } from "@/stores/billing-store";
import { useLakeshoreAccount } from "./use-lakeshore-account";

export function useLakeshoreBilling() {
  const { customer } = useLakeshoreAccount();
  const portalPayments = useBillingStore((s) => s.payments);
  const query = useQuery({
    queryKey: ["invoices", LAKESHORE_CUSTOMER_ID],
    queryFn: () => getInvoices({ customerId: LAKESHORE_CUSTOMER_ID }),
  });

  return useMemo(() => {
    const seeded = query.data ?? [];
    const invoices = applyPayments(seeded, portalPayments);
    const payments = [...portalPayments, ...recordedPayments(seeded)].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
    const open = invoices.filter(isOpen);
    const weekOut = addDays(BILLING_TODAY, 7).getTime();

    const outstanding = round2(open.reduce((s, i) => s + i.balanceDue, 0));
    const overdueList = open.filter((i) => daysPastDue(i) > 0);
    const overdue = round2(overdueList.reduce((s, i) => s + i.balanceDue, 0));
    const dueSoonList = open.filter(
      (i) => daysPastDue(i) <= 0 && Date.parse(i.dueAt) <= weekOut,
    );
    const dueSoon = round2(dueSoonList.reduce((s, i) => s + i.balanceDue, 0));

    const paidInPortal = round2(
      portalPayments.reduce((s, p) => s + p.amount, 0),
    );
    const used = Math.max(0, round2(customer.balance - paidInPortal));
    const available = Math.max(0, round2(customer.creditLimit - used));

    return {
      invoices,
      openInvoices: open,
      payments,
      portalPayments,
      aging: agingBuckets(invoices),
      summary: {
        outstanding,
        overdue,
        overdueCount: overdueList.length,
        dueSoon,
        dueSoonCount: dueSoonList.length,
        openCount: open.length,
      },
      credit: {
        limit: customer.creditLimit,
        used,
        available,
        usedPct: Math.min(100, Math.round((used / customer.creditLimit) * 100)),
      },
      isLoading: query.isLoading,
    };
  }, [query.data, query.isLoading, portalPayments, customer]);
}
