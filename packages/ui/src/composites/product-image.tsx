"use client";

import * as React from "react";
import {
  Briefcase,
  Cookie,
  CupSoda,
  HandPlatter,
  Package,
  ScrollText,
  ShoppingBag,
  SquareStack,
  Utensils,
  WrapText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@westwinds/lib";

export const CATEGORY_TINTS: Record<string, string> = {
  "Large Bags": "#E8F5EC",
  "Pastries, Desserts & Mixes": "#FFF0E8",
  "Single-Use Cutlery": "#EEF3FF",
  "Tableware & Dinnerware": "#F3EAF8",
  "Beverage Packaging & Cups": "#E5F6FB",
  "Food Prep Wraps & Films": "#FFF6DE",
  "Packaging & Operations": "#F0F2F5",
  "Commercial Napkins": "#EAF8F1",
  "Takeout & Catering Boxes": "#FFEDE5",
  "Workwear & Protective Gear": "#E8EEFF",
  // Fallbacks for any lingering labels
  Pantry: "#F0F2F5",
  Household: "#EAF8F1",
};

export const SPOTLIGHT_TINTS = [
  "#D9F0FF",
  "#DFF5E4",
  "#EDE4FF",
  "#FFE8D6",
  "#FFF3C9",
  "#D9F5F0",
  "#FFE0EA",
  "#E4ECFF",
] as const;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Large Bags": ShoppingBag,
  "Pastries, Desserts & Mixes": Cookie,
  "Single-Use Cutlery": Utensils,
  "Tableware & Dinnerware": HandPlatter,
  "Beverage Packaging & Cups": CupSoda,
  "Food Prep Wraps & Films": WrapText,
  "Packaging & Operations": Package,
  "Commercial Napkins": ScrollText,
  "Takeout & Catering Boxes": SquareStack,
  "Workwear & Protective Gear": Briefcase,
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
  category = "Packaging & Operations",
  name,
  size = "md",
  className,
  style,
  ...props
}: ProductImageProps) {
  const [failed, setFailed] = React.useState(false);
  const tint =
    CATEGORY_TINTS[category] ?? CATEGORY_TINTS["Packaging & Operations"];
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
          "relative shrink-0 overflow-hidden rounded-[var(--radius-sm)]",
          sizeClasses[size],
          className,
        )}
        style={{ backgroundColor: "#ffffff", ...style }}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundColor: tint }}
          aria-hidden
        />
        <img
          src={src!}
          alt={alt ?? name ?? category}
          className="relative h-full w-full object-contain p-2"
          loading="lazy"
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
