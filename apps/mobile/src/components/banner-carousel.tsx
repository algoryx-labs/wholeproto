"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import type { Banner } from "@westwinds/data";
import { cn } from "@westwinds/lib";

function hrefFor(banner: Banner) {
  return banner.ctaHref
    .replace("/category/", "/categories/")
    .replace("/catalog", "/categories");
}

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

  React.useEffect(() => {
    if (!embla || banners.length < 2) return;
    const id = window.setInterval(() => embla.scrollNext(), 4500);
    return () => window.clearInterval(id);
  }, [embla, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="overflow-hidden px-4" ref={emblaRef}>
        <div className="flex">
          {banners.map((b) => (
            <Link
              key={b.id}
              href={hrefFor(b)}
              className="min-w-0 shrink-0 grow-0 basis-full pr-3 active:scale-[0.99]"
            >
              {b.imageSrc ? (
                <div className="relative h-[168px] overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.imageSrc}
                    alt={b.headline}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-3 pt-10">
                    <span className="inline-flex h-8 items-center rounded-full bg-white/95 px-3 text-xs font-semibold text-[var(--primary)] shadow-sm">
                      {b.ctaLabel}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="relative h-[168px] overflow-hidden rounded-[var(--radius-lg)] px-5 py-6 text-white shadow-[var(--shadow-card)]"
                  style={{ backgroundColor: b.tintColour }}
                >
                  <p className="font-display text-xl font-semibold tracking-[-0.02em]">
                    {b.headline}
                  </p>
                  <p className="mt-1 max-w-[92%] text-sm text-white/90">
                    {b.subcopy}
                  </p>
                  <span className="mt-4 inline-flex h-9 items-center rounded-full bg-white/20 px-3 text-xs font-semibold backdrop-blur-sm">
                    {b.ctaLabel}
                  </span>
                </div>
              )}
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
              i === index
                ? "w-4 bg-[var(--primary)]"
                : "w-1.5 bg-[var(--border-strong)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
