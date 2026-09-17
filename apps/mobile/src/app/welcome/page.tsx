"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { brand, cn } from "@westwinds/lib";
import { Button, Logo } from "@westwinds/ui";

const SLIDES = [
  {
    title: "Fresh from Ontario warehouses",
    body: "Produce, dairy, and pantry staples scheduled around your day — not the other way around.",
    tint: "#DDF0D5",
  },
  {
    title: "Same stock, neighbour delivery",
    body: "Westwinds runs the warehouses behind your favourite grocers. Now they deliver to your door.",
    tint: "#E6EEF9",
  },
  {
    title: "Slots that actually show up",
    body: "Pick a delivery window, track the van live, and reorder favourites in two taps.",
    tint: "#FDF1DC",
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
    <div className="flex min-h-[calc(100%-0px)] flex-col px-5 pb-6 pt-4">
      <div className="flex items-center justify-between">
        <Logo size="sm" />
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--primary)] active:scale-[0.98]"
        >
          Skip
        </Link>
      </div>

      <div className="mt-6 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((s) => (
            <div key={s.title} className="min-w-0 shrink-0 grow-0 basis-full">
              <div
                className="mb-6 flex h-56 items-end rounded-[var(--radius-lg)] p-5"
                style={{ backgroundColor: s.tint }}
              >
                <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {brand.mobileAppName}
                </p>
              </div>
              <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">
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
            className="h-12 w-full text-base active:scale-[0.98]"
            onClick={() => embla?.scrollNext()}
          >
            Continue
          </Button>
        ) : (
          <Button asChild size="lg" className="h-12 w-full text-base active:scale-[0.98]">
            <Link href="/login">Get started</Link>
          </Button>
        )}
      </div>
    </div>
  );
}