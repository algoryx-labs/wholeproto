import * as React from "react";
import { brand, cn } from "@westwinds/lib";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  wordmark?: string;
  /** When true, render only the mark image (logo already includes text). */
  markOnly?: boolean;
}

const sizeMap = {
  sm: { mark: "h-9 w-auto max-w-[7.5rem]", text: "text-sm" },
  md: { mark: "h-11 w-auto max-w-[9.5rem]", text: "text-base" },
  lg: { mark: "h-16 w-auto max-w-[12rem]", text: "text-xl" },
} as const;

function Logo({
  className,
  size = "md",
  showWordmark: _showWordmark = false,
  wordmark = brand.shortName,
  markOnly: _markOnly,
  ...props
}: LogoProps) {
  const s = sizeMap[size];
  // Full logo asset already includes the wordmark — never duplicate text.
  void _showWordmark;
  void _markOnly;

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-black",
          s.mark,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logoSrc}
          alt={wordmark}
          className="h-full w-auto object-contain"
        />
      </span>
    </div>
  );
}

export { Logo };
