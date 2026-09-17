"use client";

import * as React from "react";
import { Battery, Signal, Wifi } from "lucide-react";
import { Toaster } from "@westwinds/ui";
import { cn } from "@westwinds/lib";
import {
  BEZEL,
  FRAME_BREAKPOINT,
  FRAME_SCALE_VH,
  OUTER_RADIUS,
  SCREEN_H,
  SCREEN_RADIUS,
  SCREEN_W,
  STATUS_BAR_H,
} from "@/lib/constants";
import { PhoneFrameProvider } from "./phone-frame-context";

function StatusBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-end justify-between px-7 pb-2 text-[13px] font-semibold text-[var(--foreground)]"
      style={{ height: STATUS_BAR_H }}
    >
      <span className="tabular">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="size-3.5" strokeWidth={2.5} />
        <Wifi className="size-3.5" strokeWidth={2.5} />
        <Battery className="size-4" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-40 flex justify-center">
      <div className="h-[5px] w-[134px] rounded-full bg-[var(--foreground)]/80" />
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[18px] z-50 h-9 w-[126px] -translate-x-1/2 rounded-full bg-black" />
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const screenRef = React.useRef<HTMLDivElement>(null);
  const [screenEl, setScreenEl] = React.useState<HTMLElement | null>(null);
  const [framed, setFramed] = React.useState(true);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    setScreenEl(screenRef.current);
  }, []);

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setFramed(w >= FRAME_BREAKPOINT);
      const outerH = SCREEN_H + BEZEL * 2;
      if (w >= FRAME_BREAKPOINT && h < FRAME_SCALE_VH) {
        setScale(Math.min(1, (h - 32) / outerH));
      } else {
        setScale(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const screenClass = cn(
    "phone-screen relative bg-[var(--background)] text-[var(--foreground)]",
    "overflow-y-auto overscroll-contain",
    "[transform:translateZ(0)]",
  );

  if (!framed) {
    return (
      <PhoneFrameProvider screenEl={screenEl} framed={false}>
        <div
          ref={screenRef}
          className={cn(screenClass, "min-h-dvh w-full")}
        >
          <StatusBar />
          <div className="relative min-h-dvh pt-[54px] pb-8">{children}</div>
          <HomeIndicator />
          <Toaster position="top-center" offset={58} richColors closeButton />
        </div>
      </PhoneFrameProvider>
    );
  }

  const outerW = SCREEN_W + BEZEL * 2;
  const outerH = SCREEN_H + BEZEL * 2;

  return (
    <PhoneFrameProvider screenEl={screenEl} framed>
      <div
        className="flex min-h-dvh items-center justify-center"
        style={{
          backgroundColor: "#E9EDEA",
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.7), transparent 70%)",
        }}
      >
        <div
          style={{
            width: outerW,
            height: outerH,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="relative h-full w-full shadow-[0_24px_60px_rgba(14,26,21,0.18)]"
            style={{
              backgroundColor: "#1C1F1E",
              borderRadius: OUTER_RADIUS,
              padding: BEZEL,
            }}
          >
            <DynamicIsland />
            <div
              ref={screenRef}
              className={screenClass}
              style={{
                width: SCREEN_W,
                height: SCREEN_H,
                borderRadius: SCREEN_RADIUS,
              }}
            >
              <StatusBar />
              <div className="relative min-h-full pt-[54px] pb-8">{children}</div>
              <HomeIndicator />
              <Toaster position="top-center" offset={58} richColors closeButton />
            </div>
          </div>
        </div>
      </div>
    </PhoneFrameProvider>
  );
}