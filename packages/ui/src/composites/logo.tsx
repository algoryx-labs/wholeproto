import * as React from "react";
import { Leaf } from "lucide-react";
import { cn } from "@westwinds/lib";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  wordmark?: string;
  src?: string;
}

const sizeMap = {
  sm: { mark: "h-6 w-6", icon: "h-3.5 w-3.5", image: "h-9", text: "text-sm" },
  md: { mark: "h-8 w-8", icon: "h-4 w-4", image: "h-16", text: "text-base" },
  lg: { mark: "h-10 w-10", icon: "h-5 w-5", image: "h-24", text: "text-xl" },
} as const;

function Logo({
  className,
  size = "md",
  showWordmark = true,
  wordmark = "Westwinds",
  src,
  ...props
}: LogoProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={showWordmark ? "" : wordmark}
          aria-hidden={showWordmark || undefined}
          className={cn("w-auto object-contain", s.image)}
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[var(--primary-foreground)]",
            s.mark,
          )}
          aria-hidden
        >
          <Leaf className={s.icon} strokeWidth={2.25} />
        </span>
      )}
      {showWordmark ? (
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
