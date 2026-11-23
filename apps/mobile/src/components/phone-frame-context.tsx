"use client";

import * as React from "react";

type StatusTone = "dark" | "light";

interface PhoneFrameContextValue {
  screenEl: HTMLElement | null;
  chromeEl: HTMLElement | null;
  framed: boolean;
  statusTone: StatusTone;
  setStatusTone: (tone: StatusTone) => void;
}

const PhoneFrameContext = React.createContext<PhoneFrameContextValue>({
  screenEl: null,
  chromeEl: null,
  framed: false,
  statusTone: "dark",
  setStatusTone: () => undefined,
});

export function usePhoneFrame() {
  return React.useContext(PhoneFrameContext);
}

/** Sets status-bar icon/text tone for coloured headers. Resets on unmount. */
export function useStatusBarTone(tone: StatusTone) {
  const { setStatusTone } = usePhoneFrame();
  React.useEffect(() => {
    setStatusTone(tone);
    return () => setStatusTone("dark");
  }, [tone, setStatusTone]);
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
  const [statusTone, setStatusTone] = React.useState<StatusTone>("dark");
  const value = React.useMemo(
    () => ({ screenEl, chromeEl, framed, statusTone, setStatusTone }),
    [screenEl, chromeEl, framed, statusTone],
  );
  return (
    <PhoneFrameContext.Provider value={value}>
      {children}
    </PhoneFrameContext.Provider>
  );
}
