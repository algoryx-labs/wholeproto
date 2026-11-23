"use client";

import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { getDailySales } from "@westwinds/data";
import { formatCurrency, formatDate } from "@westwinds/lib";
import {
  Button,
  Money,
  PageHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@westwinds/ui";

export default function ReportsPage() {
  const salesQ = useQuery({
    queryKey: ["daily-sales", 30],
    queryFn: () => getDailySales(30),
  });

  const rows = [...(salesQ.data ?? [])].reverse();

  function exportCsv() {
    const csv = Papa.unparse(
      rows.map((r) => ({
        date: r.date,
        b2b_revenue: r.b2bRevenue,
        b2c_revenue: r.b2cRevenue,
        total_revenue: r.totalRevenue,
        b2b_orders: r.b2bOrders,
        b2c_orders: r.b2cOrders,
        total_orders: r.totalOrders,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calgary-wholesale-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Daily sales across B2B Trade and the consumer app."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={exportCsv}
            disabled={!rows.length}
          >
            Export CSV
          </Button>
        }
      />

      {salesQ.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">B2B</TableHead>
                <TableHead className="text-right">App</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.date}>
                  <TableCell>{formatDate(r.date)}</TableCell>
                  <TableCell className="text-right">
                    <Money amount={r.b2bRevenue} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={r.b2cRevenue} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(r.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {r.totalOrders}
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
