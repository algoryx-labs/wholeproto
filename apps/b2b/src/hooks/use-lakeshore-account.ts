"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getB2BCustomer,
  getPriceGroups,
  LAKESHORE_CUSTOMER_ID,
  lakeshoreCustomer,
  type PriceGroup,
} from "@westwinds/data";

export function useLakeshoreAccount() {
  const customerQuery = useQuery({
    queryKey: ["b2b-customer", LAKESHORE_CUSTOMER_ID],
    queryFn: () => getB2BCustomer(LAKESHORE_CUSTOMER_ID),
  });
  const groupsQuery = useQuery({
    queryKey: ["price-groups"],
    queryFn: () => getPriceGroups(),
  });

  const customer = customerQuery.data ?? lakeshoreCustomer;
  const priceGroup: PriceGroup | undefined = groupsQuery.data?.find(
    (g) => g.id === customer.priceGroupId,
  );

  return {
    customer,
    priceGroup,
    isLoading: customerQuery.isLoading || groupsQuery.isLoading,
  };
}
