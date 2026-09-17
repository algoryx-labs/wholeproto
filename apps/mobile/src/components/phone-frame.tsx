"use client";

import * as React from "react";
import { Battery, Signal, Wifi } from "lucide-react";
import { Toaster } from "@westwinds/ui";
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
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-50 flex justify-center">
      <div className="h-[5px] w-[134px] rounded-full bg-[var(--foreground)]/80" />
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[18px] z-50 h-9 w-[126px] -translate-x-1/2 rounded-full bg-black" />
  );
}

/**
 * Layered screen:
 * - scroll layer (absolute inset) — page content only
 * - chrome layer (absolute bottom) — cart + tabs, never scrolls
 */
function ScreenShell({
  screenRef,
  chromeRef,
  width,
  height,
  borderRadius,
  children,
}: {
  screenRef: React.RefCallback<HTMLDivElement>;
  chromeRef: React.RefCallback<HTMLDivElement>;
  width: number | string;
  height: number | string;
  borderRadius?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={screenRef}
      className="phone-screen bg-[var(--background)] text-[var(--foreground)]"
      style={{
        position: "relative",
        width,
        height,
        borderRadius,
        overflow: "hidden",
        transform: "translateZ(0)",
        isolation: "isolate",
      }}
    >
      <StatusBar />

      <div
        className="phone-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflowX: "hidden",
          overflowY: "auto",
          overscrollBehavior: "contain",
          paddingTop: STATUS_BAR_H,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>

      {/* Non-scrolling chrome mount — cart bar + tabs portal here */}
      <div
        ref={chromeRef}
        className="phone-chrome"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          pointerEvents: "none",
        }}
      />

      <HomeIndicator />
      <Toaster position="top-center" offset={58} richColors closeButton />
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [screenEl, setScreenEl] = React.useState<HTMLElement | null>(null);
  const [chromeEl, setChromeEl] = React.useState<HTMLElement | null>(null);
  const [framed, setFramed] = React.useState(true);
  const [scale, setScale] = React.useState(1);

  const screenRef = React.useCallback((node: HTMLDivElement | null) => {
    setScreenEl(node);
  }, []);
  const chromeRef = React.useCallback((node: HTMLDivElement | null) => {
    setChromeEl(node);
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

  const body = (
    <div style={{ position: "relative", minHeight: "100%", paddingBottom: 8 }}>
      {children}
    </div>
  );

  if (!framed) {
    return (
      <PhoneFrameProvider screenEl={screenEl} chromeEl={chromeEl} framed={false}>
        <ScreenShell
          screenRef={screenRef}
          chromeRef={chromeRef}
          width="100%"
          height="100dvh"
        >
          {body}
        </ScreenShell>
      </PhoneFrameProvider>
    );
  }

  const outerW = SCREEN_W + BEZEL * 2;
  const outerH = SCREEN_H + BEZEL * 2;

  return (
    <PhoneFrameProvider screenEl={screenEl} chromeEl={chromeEl} framed>
      <div
        className="flex min-h-dvh items-center justify-center overflow-hidden"
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
            <ScreenShell
              screenRef={screenRef}
              chromeRef={chromeRef}
              width={SCREEN_W}
              height={SCREEN_H}
              borderRadius={SCREEN_RADIUS}
            >
              {body}
            </ScreenShell>
          </div>
        </div>
      </div>
    </PhoneFrameProvider>
  );
}
