"use client";

import { useEffect } from "react";

const RIPPLE_TARGETS = '[data-slot="button"], [data-slot="tabs-trigger"]';

/**
 * Click ripple for every shared button and tab. Renders nothing; the app's
 * stylesheet styles `.ui-ripple-clip` and `.ui-ripple`.
 */
export function InteractionEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function onPointerDown(event: PointerEvent) {
      if (reduceMotion.matches || event.button !== 0) return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(RIPPLE_TARGETS);
      if (!target || target.matches(":disabled, [aria-disabled='true']")) return;

      if (getComputedStyle(target).position === "static") {
        target.style.position = "relative";
      }

      const rect = target.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 2.2;

      const clip = document.createElement("span");
      clip.className = "ui-ripple-clip";
      const wave = document.createElement("span");
      wave.className = "ui-ripple";
      wave.style.width = wave.style.height = `${diameter}px`;
      wave.style.left = `${event.clientX - rect.left - diameter / 2}px`;
      wave.style.top = `${event.clientY - rect.top - diameter / 2}px`;
      clip.appendChild(wave);
      target.appendChild(clip);

      wave.addEventListener("animationend", () => clip.remove(), { once: true });
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
