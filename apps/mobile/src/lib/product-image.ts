/** Local product artwork served from `apps/mobile/public/products/{sku}.svg`. */
export function productImageSrc(sku: string): string {
  return `/products/${sku}.svg`;
}
