"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { toast } from "sonner";
import { getProducts, type Product } from "@westwinds/data";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  PageHeader,
  SectionCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@westwinds/ui";
import { FileUp, Plus, Trash2 } from "lucide-react";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { casePriceForProduct } from "@/lib/pricing";
import { useCartStore } from "@/stores/cart-store";

interface Row {
  id: string;
  sku: string;
  qty: string;
}

interface Validated {
  sku: string;
  qty: number;
  product?: Product;
  error?: string;
}

function newRow(): Row {
  return { id: crypto.randomUUID(), sku: "", qty: "1" };
}

export default function QuickOrderPage() {
  const [rows, setRows] = React.useState<Row[]>([newRow(), newRow(), newRow()]);
  const [paste, setPaste] = React.useState("");
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const addLine = useCartStore((s) => s.addLine);
  const { priceGroup } = useLakeshoreAccount();

  const productsQuery = useQuery({
    queryKey: ["products-b2b-all"],
    queryFn: () => getProducts({ channel: "b2b", status: "active" }),
  });
  const products = productsQuery.data ?? [];
  const bySku = React.useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) map.set(p.sku.toLowerCase(), p);
    return map;
  }, [products]);

  const suggestions = React.useMemo(() => {
    if (!focusId) return [];
    const row = rows.find((r) => r.id === focusId);
    const q = row?.sku.trim().toLowerCase() ?? "";
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [focusId, rows, products]);

  const validated: Validated[] = rows
    .filter((r) => r.sku.trim())
    .map((r) => {
      const product = bySku.get(r.sku.trim().toLowerCase());
      const qty = Number(r.qty);
      if (!product) return { sku: r.sku.trim(), qty, error: "Unknown SKU" };
      if (!Number.isFinite(qty) || qty < 1)
        return { sku: r.sku.trim(), qty, product, error: "Qty must be ≥ 1" };
      return { sku: product.sku, qty: Math.floor(qty), product };
    });

  const validLines = validated.filter((v) => v.product && !v.error);

  const applyPairs = (pairs: Array<{ sku: string; qty: string }>) => {
    if (!pairs.length) return;
    setRows(pairs.map((p) => ({ id: crypto.randomUUID(), ...p })));
  };

  const parsePaste = () => {
    const pairs = paste
      .split(/\n|;/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [sku, qty] = line.split(/[,\t ]+/);
        return { sku: sku ?? "", qty: qty ?? "1" };
      })
      .filter((p) => p.sku);
    applyPairs(pairs);
    toast.success(`Parsed ${pairs.length} lines`);
  };

  const onCsv = (file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const pairs = result.data
          .map((row) => {
            const sku =
              row.sku ?? row.SKU ?? row.Sku ?? Object.values(row)[0] ?? "";
            const qty =
              row.qty ?? row.quantity ?? row.Qty ?? Object.values(row)[1] ?? "1";
            return { sku: String(sku).trim(), qty: String(qty).trim() || "1" };
          })
          .filter((p) => p.sku);
        applyPairs(pairs);
        toast.success(`Imported ${pairs.length} rows from CSV`);
      },
    });
  };

  const addValid = () => {
    for (const line of validLines) {
      if (!line.product) continue;
      addLine({
        productId: line.product.id,
        sku: line.product.sku,
        name: line.product.name,
        qty: line.qty,
        unitPrice: casePriceForProduct(line.product, priceGroup, line.qty),
      });
    }
    toast.success(`Added ${validLines.length} valid lines to cart`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quick order"
        description="Enter SKUs, paste a list, or upload a CSV — then validate and add to cart."
        actions={
          <Button type="button" disabled={!validLines.length} onClick={addValid}>
            Add {validLines.length} valid to cart
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="SKU rows"
          actions={
            <Button type="button" size="sm" variant="outline" onClick={() => setRows((r) => [...r, newRow()])}>
              <Plus className="size-3.5" />
              Row
            </Button>
          }
        >
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="relative flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Input
                    placeholder="SKU or name"
                    value={row.sku}
                    onFocus={() => setFocusId(row.id)}
                    onBlur={() => setTimeout(() => setFocusId(null), 150)}
                    onChange={(e) =>
                      setRows((list) =>
                        list.map((r) =>
                          r.id === row.id ? { ...r, sku: e.target.value } : r,
                        ),
                      )
                    }
                  />
                  {focusId === row.id && suggestions.length > 0 ? (
                    <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]">
                      {suggestions.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--primary-soft)]"
                            onMouseDown={() =>
                              setRows((list) =>
                                list.map((r) =>
                                  r.id === row.id ? { ...r, sku: p.sku } : r,
                                ),
                              )
                            }
                          >
                            <span className="font-mono text-xs">{p.sku}</span>
                            <span className="ml-2 text-[var(--muted-foreground)]">
                              {p.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <Input
                  className="w-20"
                  value={row.qty}
                  onChange={(e) =>
                    setRows((list) =>
                      list.map((r) =>
                        r.id === row.id ? { ...r, qty: e.target.value } : r,
                      ),
                    )
                  }
                  aria-label="Quantity"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setRows((list) => list.filter((r) => r.id !== row.id))}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Paste SKU, qty">
            <Textarea
              rows={5}
              placeholder={"CW-PRD-3003, 10\nCW-DRY-8805, 8"}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
            />
            <Button type="button" className="mt-3" variant="secondary" onClick={parsePaste}>
              Parse paste
            </Button>
          </SectionCard>
          <SectionCard title="CSV upload">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] px-4 py-8 text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-sunken)]">
              <FileUp className="size-5 text-[var(--primary)]" />
              Upload CSV with sku, qty columns
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onCsv(file);
                }}
              />
            </label>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Validation">
        {validated.length === 0 ? (
          <EmptyState message="Enter SKUs above to validate lines before adding to cart." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Case price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validated.map((line, i) => (
                <TableRow key={`${line.sku}-${i}`}>
                  <TableCell className="font-mono text-xs">{line.sku}</TableCell>
                  <TableCell>{line.product?.name ?? "—"}</TableCell>
                  <TableCell className="text-right tabular">{line.qty || "—"}</TableCell>
                  <TableCell className="text-right">
                    {line.product
                      ? casePriceForProduct(line.product, priceGroup, line.qty).toLocaleString(
                          "en-CA",
                          { style: "currency", currency: "CAD" },
                        )
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {line.error ? (
                      <Badge variant="danger">{line.error}</Badge>
                    ) : (
                      <Badge variant="success">Ready</Badge>
                    )}
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
