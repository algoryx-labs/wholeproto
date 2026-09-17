"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import {
  categoryById,
  getProduct,
  getStockLevels,
  warehouses,
} from "@westwinds/data";
import { formatCurrency } from "@westwinds/lib";
import {
  Button,
  ProductImage,
  QuantityStepper,
  Skeleton,
  StockHealth,
  StatusBadge,
} from "@westwinds/ui";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";
import { productImageSrc } from "@/lib/product-image";

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const getQty = useCartStore((s) => s.getQty);
  const setQty = useCartStore((s) => s.setQty);
  const [qty, setLocalQty] = React.useState(1);

  const productQ = useQuery({
    queryKey: ["product", sku],
    queryFn: () => getProduct(sku),
  });
  const product = productQ.data;
  const stockQ = useQuery({
    queryKey: ["stock", product?.id],
    queryFn: () => getStockLevels({ productId: product!.id }),
    enabled: Boolean(product?.id),
  });

  const category = product ? categoryById[product.categoryId] : undefined;
  const inCart = product ? getQty(product.id) : 0;
  const onHand = (stockQ.data ?? []).reduce((n, s) => n + s.onHand, 0);
  const health =
    onHand <= 0 ? "out_of_stock" : onHand < 40 ? "low_stock" : "in_stock";

  const warehouseRows = (stockQ.data ?? []).map((s) => {
    const wh = warehouses.find((w) => w.id === s.warehouseId);
    return {
      warehouseId: s.warehouseId,
      warehouseCode: wh?.code,
      onHand: s.onHand,
      reorderPoint: s.reorderPoint,
    };
  });

  const addToCart = () => {
    if (!product) return;
    if (inCart > 0) {
      setQty(product.id, inCart + qty);
    } else {
      addItem(
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          unitPrice: product.b2cPrice,
          categoryName: category?.name,
          imageHint: product.imageHint,
          imageSrc: productImageSrc(product.sku),
        },
        qty,
      );
    }
    toast.success("Added to cart");
  };

  if (productQ.isLoading) {
    return (
      <div className="space-y-4 px-4 pt-2">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-48 w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 pt-8 text-center text-[var(--muted-foreground)]">
        Product not found.
        <div className="mt-4">
          <Button asChild variant="soft">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-28">
      <div className="flex items-center gap-2 px-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface)] active:scale-[0.98]"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </button>
      </div>

      <div className="mt-2 px-4">
        <ProductImage
          src={productImageSrc(product.sku)}
          category={category?.name ?? "Pantry"}
          name={product.name}
          size="lg"
          className="h-52 w-full rounded-[var(--radius-lg)]"
        />
      </div>

      <div className="mt-5 space-y-3 px-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {product.brand} · {product.unitSize}
        </p>
        <h1 className="font-display text-[1.65rem] font-semibold leading-tight tracking-[-0.03em]">
          {product.name}
        </h1>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tabular">
            {formatCurrency(product.b2cPrice)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-[var(--subtle-foreground)] line-through tabular">
              {formatCurrency(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={health} />
          <StockHealth variant="dots" warehouses={warehouseRows} unit="units" />
        </div>

        <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
          <span className="text-sm font-medium">Quantity</span>
          <QuantityStepper value={qty} onChange={setLocalQty} min={1} max={99} />
        </div>

        <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
          {product.description}
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 px-4 pb-6 pt-3 backdrop-blur-md">
        <Button
          size="lg"
          className="h-12 w-full text-base active:scale-[0.98]"
          onClick={addToCart}
          disabled={health === "out_of_stock"}
        >
          Add to cart · {formatCurrency(product.b2cPrice * qty)}
        </Button>
      </div>
    </div>
  );
}