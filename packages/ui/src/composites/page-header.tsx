import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@calgarywholesale/lib";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

function PageHeader({
  className,
  title,
  description,
  actions,
  breadcrumbs,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-[var(--muted-foreground)]">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 ? (
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                  ) : null}
                  {crumb.href && !isLast ? (
                    <a
                      href={crumb.href}
                      className="hover:text-[var(--primary)] transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={cn(isLast && "text-[var(--foreground)] font-medium")}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export { PageHeader };
