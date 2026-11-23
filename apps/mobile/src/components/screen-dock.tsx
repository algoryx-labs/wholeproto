"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePhoneFrame } from "./phone-frame-context";

/**
 * Renders children into the non-scrolling phone chrome layer (bottom of device).
 */
export function ScreenDock({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { chromeEl } = usePhoneFrame();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !chromeEl) return null;

  return createPortal(
    <div
      className={className}
      style={{
        pointerEvents: "auto",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>,
    chromeEl,
  );
}
