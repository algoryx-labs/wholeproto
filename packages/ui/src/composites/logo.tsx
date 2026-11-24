import * as React from "react";
import { brand, cn } from "@calgarywholesale/lib";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  /** The logo artwork already contains the name, so text is opt-in. */
  showWordmark?: boolean;
  wordmark?: string;
  src?: string;
  /** When true, render only the mark image (logo already includes text). */
  markOnly?: boolean;
}

const sizeMap = {
  sm: { image: "h-9 max-w-[7.5rem]", text: "text-sm" },
  md: { image: "h-14 max-w-[9.5rem]", text: "text-base" },
  lg: { image: "h-20 max-w-[12rem]", text: "text-xl" },
} as const;

function Logo({
  className,
  size = "md",
  showWordmark = false,
  wordmark = brand.shortName,
  src = brand.logoSrc,
  markOnly = false,
  ...props
}: LogoProps) {
  const s = sizeMap[size];
  const withText = showWordmark && !markOnly;
  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <img
        src={src}
        alt={withText ? "" : wordmark}
        aria-hidden={withText || undefined}
        className={cn("w-auto shrink-0 object-contain", s.image)}
      />
      {withText ? (
        <span
          className={cn(
            "font-display font-semibold tracking-tight text-[var(--foreground)]",
            s.text,
          )}
        >
          {wordmark}
        </span>
      ) : null}
    </div>
  );
}

export { Logo };
