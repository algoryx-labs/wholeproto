"use client";

import * as React from "react";

interface PhoneFrameContextValue {
  screenEl: HTMLElement | null;
  framed: boolean;
}

const PhoneFrameContext = React.createContext<PhoneFrameContextValue>({
  screenEl: null,
  framed: false,
});

export function usePhoneFrame() {
  return React.useContext(PhoneFrameContext);
}

export function PhoneFrameProvider({
  screenEl,
  framed,
  children,
}: {
  screenEl: HTMLElement | null;
  framed: boolean;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ screenEl, framed }),
    [screenEl, framed],
  );
  return (
    <PhoneFrameContext.Provider value={value}>
      {children}
    </PhoneFrameContext.Provider>
  );
}