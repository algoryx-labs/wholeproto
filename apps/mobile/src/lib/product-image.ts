import manifest from "./product-image-manifest.json";

const imageBySku = manifest as Record<string, string>;

/** Product artwork from Wholesale Calgary catalog photos (local `/products/{sku}.webp`). */
export function productImageSrc(sku: string): string {
  return imageBySku[sku] ?? `/products/${sku}.webp`;
}
