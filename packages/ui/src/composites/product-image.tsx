"use client";

import * as React from "react";
import {
  Apple,
  Beef,
  Cookie,
  Droplets,
  Package,
  Snowflake,
  SprayCan,
  Wheat,
  Wine,
  Milk,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@westwinds/lib";

export const CATEGORY_TINTS: Record<string, string> = {
  Produce: "#DDF0D5",
  "Dairy & Eggs": "#E6EEF9",
  Bakery: "#F6E8D4",
  "Meat & Seafood": "#F8E1DF",
  Beverages: "#DDEEF0",
  Snacks: "#FBEBD0",
  Pantry: "#EFE8DB",
  Frozen: "#E3ECF7",
  Household: "#ECE8F4",
  "Personal Care": "#F4E4EC",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Produce: Apple,
  "Dairy & Eggs": Milk,
  Bakery: Wheat,
  "Meat & Seafood": Beef,
  Beverages: Wine,
  Snacks: Cookie,
  Pantry: Package,
  Frozen: Snowflake,
  Household: SprayCan,
  "Personal Care": Droplets,
};

export interface ProductImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  category?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-base",
} as const;

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

function ProductImage({
  src,
  alt,
  category = "Pantry",
  name,
  size = "md",
  className,
  style,
  ...props
}: ProductImageProps) {
  const [failed, setFailed] = React.useState(false);
  const tint = CATEGORY_TINTS[category] ?? CATEGORY_TINTS.Pantry;
  const Icon = CATEGORY_ICONS[category] ?? Package;
  const initial = (name ?? category).charAt(0).toUpperCase();
  const showImage = Boolean(src) && !failed;

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  if (showImage) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]",
          sizeClasses[size],
          className,
        )}
        style={style}
        {...props}
      >
        <img
          src={src!}
          alt={alt ?? name ?? category}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[var(--radius-sm)] font-medium text-[var(--foreground)]/70",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: tint, ...style }}
      aria-label={alt ?? name ?? category}
      {...props}
    >
      <Icon className={cn(iconSizes[size], "opacity-70")} />
      <span className="leading-none">{initial}</span>
    </div>
  );
}

export { ProductImage };
