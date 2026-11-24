import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@calgarywholesale/lib";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]",
        secondary:
          "border-transparent bg-[var(--surface-sunken)] text-[var(--foreground)]",
        outline: "border-[var(--border-strong)] text-[var(--foreground)]",
        success:
          "border-transparent bg-[var(--success-soft)] text-[var(--success)]",
        warning:
          "border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",
        danger:
          "border-transparent bg-[var(--danger-soft)] text-[var(--danger)]",
        info: "border-transparent bg-[var(--info-soft)] text-[var(--info)]",
        offer: "border-transparent bg-[var(--offer-soft)] text-[var(--offer)]",
        soft: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
