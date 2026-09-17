"use client";

import * as React from "react";

interface PhoneFrameContextValue {
  screenEl: HTMLElement | null;
  chromeEl: HTMLElement | null;
  framed: boolean;
}

const PhoneFrameContext = React.createContext<PhoneFrameContextValue>({
  screenEl: null,
  chromeEl: null,
  framed: false,
});

export function usePhoneFrame() {
  return React.useContext(PhoneFrameContext);
}

export function PhoneFrameProvider({
  screenEl,
  chromeEl,
  framed,
  children,
}: {
  screenEl: HTMLElement | null;
  chromeEl: HTMLElement | null;
  framed: boolean;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ screenEl, chromeEl, framed }),
    [screenEl, chromeEl, framed],
  );
  return (
    <PhoneFrameContext.Provider value={value}>
      {children}
    </PhoneFrameContext.Provider>
  );
}
