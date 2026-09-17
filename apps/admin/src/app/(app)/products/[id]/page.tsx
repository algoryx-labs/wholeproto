"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryById, getProduct } from "@westwinds/data";
import { formatCurrency } from "@westwinds/lib";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Money,
  PageHeader,
  ProductImage,
  SectionCard,
  Skeleton,
  Switch,
} from "@westwinds/ui";
import { useProductStore } from "@/stores/product-store";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const overlay = useProductStore((s) => s.overlays[id] ?? {});

  const productQ = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });

  const product = productQ.data;
  const [name, setName] = React.useState("");
  const [b2cPrice, setB2cPrice] = React.useState(0);
  const [b2bCasePrice, setB2bCasePrice] = React.useState(0);
  const [visibleOnB2B, setVisibleOnB2B] = React.useState(true);
  const [visibleOnMobile, setVisibleOnMobile] = React.useState(true);

  React.useEffect(() => {
    if (!product) return;
    setName(overlay.name ?? product.name);
    setB2cPrice(overlay.b2cPrice ?? product.b2cPrice);
    setB2bCasePrice(overlay.b2bCasePrice ?? product.b2bCasePrice);
    setVisibleOnB2B(overlay.visibleOnB2B ?? product.visibleOnB2B);
    setVisibleOnMobile(overlay.visibleOnMobile ?? product.visibleOnMobile);
  }, [product, overlay]);

  if (productQ.isLoading) return <Skeleton className="h-72 w-full" />;
  if (!product) {
    return (
      <PageHeader title="Product not found" description={`No product ${id}.`} />
    );
  }

  const category = categoryById[product.categoryId]?.name ?? "Pantry";

  function save() {
    updateProduct(product!.id, {
      name,
      b2cPrice,
      b2bCasePrice,
      visibleOnB2B,
      visibleOnMobile,
    });
    toast.success("Product updated", {
      description: "Listing preview reflects live edits.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={name}
        description={product.sku}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: product.sku },
        ]}
        actions={
          <Button type="button" onClick={save}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Edit listing">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="b2b">B2B case price (CAD)</Label>
                <Input
                  id="b2b"
                  type="number"
                  step="0.01"
                  value={b2bCasePrice}
                  onChange={(e) => setB2bCasePrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b2c">App unit price (CAD)</Label>
                <Input
                  id="b2c"
                  type="number"
                  step="0.01"
                  value={b2cPrice}
                  onChange={(e) => setB2cPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2">
              <Label htmlFor="vis-b2b">Visible on Trade (B2B)</Label>
              <Switch
                id="vis-b2b"
                checked={visibleOnB2B}
                onCheckedChange={setVisibleOnB2B}
              />
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2">
              <Label htmlFor="vis-app">Visible on mobile app</Label>
              <Switch
                id="vis-app"
                checked={visibleOnMobile}
                onCheckedChange={setVisibleOnMobile}
              />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[var(--muted-foreground)]">
                Mobile card preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto w-[220px] rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
                <ProductImage category={category} name={name} size="lg" />
                <p className="mt-2 text-sm font-semibold leading-snug">{name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {product.unitSize}
                </p>
                <p className="mt-1 font-display text-lg font-semibold tabular">
                  {formatCurrency(b2cPrice)}
                </p>
                {!visibleOnMobile ? (
                  <Badge variant="warning" className="mt-2">
                    Hidden on app
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[var(--muted-foreground)]">
                B2B row preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs tabular text-[var(--muted-foreground)]">
                    {product.sku} · {product.casePack}
                  </p>
                </div>
                <div className="text-right">
                  <Money amount={b2bCasePrice} className="font-semibold" />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    / case
                  </p>
                </div>
              </div>
              {!visibleOnB2B ? (
                <Badge variant="warning" className="mt-2">
                  Hidden on Trade
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
