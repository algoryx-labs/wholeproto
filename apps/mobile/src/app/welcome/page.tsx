"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { brand, cn } from "@calgarywholesale/lib";
import { Button, Logo } from "@calgarywholesale/ui";

const SLIDES = [
  {
    title: "Fresh from Calgary warehouses",
    body: "Produce, dairy, and pantry staples scheduled around your day — not the other way around.",
    image: "/assets/Bg1.jpg",
  },
  {
    title: "Disposables ready in bulk",
    body: "Cups, containers, cutlery, and bags — everything your kitchen needs, delivered.",
    image: "/assets/bg2.jpg",
  },
  {
    title: "Slots that actually show up",
    body: "Pick a delivery window, track the van live, and reorder favourites in two taps.",
    image: "/assets/Bg1.jpg",
  },
];

export default function WelcomePage() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false });
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

  return (
    <div className="flex min-h-[calc(100%-0px)] flex-col bg-white px-5 pb-6 pt-4">
      <div className="flex items-center justify-between">
        <Logo size="sm" />
        <Link
          href="/login"
          className="text-sm font-semibold text-[var(--primary)] active:scale-[0.98]"
        >
          Skip
        </Link>
      </div>

      <div className="mt-6 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((s) => (
            <div key={s.title} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className="relative mb-6 h-56 overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute left-3 top-3 overflow-hidden rounded-[var(--radius-sm)] bg-black/90 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoSrc}
                    alt={brand.mobileAppName}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em]">
                {s.title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index
                ? "w-5 bg-[var(--primary)]"
                : "w-1.5 bg-[var(--border-strong)]",
            )}
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {index < SLIDES.length - 1 ? (
          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base font-semibold active:scale-[0.98]"
            onClick={() => embla?.scrollNext()}
          >
            Continue
          </Button>
        ) : (
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-full text-base font-semibold active:scale-[0.98]"
          >
            <Link href="/login">Get started</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
