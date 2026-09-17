"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import type { Banner } from "@westwinds/data";
import { cn } from "@westwinds/lib";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="overflow-hidden px-4" ref={emblaRef}>
        <div className="flex">
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.ctaHref.replace("/category/", "/categories/").replace("/catalog", "/categories")}
              className="min-w-0 shrink-0 grow-0 basis-full pr-0 active:scale-[0.99]"
            >
              <div
                className="relative overflow-hidden rounded-[var(--radius-lg)] px-5 py-6 text-white"
                style={{ backgroundColor: b.tintColour }}
              >
                <p className="font-display text-xl font-semibold tracking-[-0.02em]">
                  {b.headline}
                </p>
                <p className="mt-1 max-w-[90%] text-sm text-white/85">
                  {b.subcopy}
                </p>
                <span className="mt-4 inline-flex h-9 items-center rounded-full bg-white/20 px-3 text-xs font-semibold">
                  {b.ctaLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-4 bg-[var(--primary)]" : "w-1.5 bg-[var(--border-strong)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}