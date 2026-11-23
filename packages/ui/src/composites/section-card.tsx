import * as React from "react";
import { cn } from "@westwinds/lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

function SectionCard({
  className,
  title,
  description,
  actions,
  footer,
  children,
  ...props
}: SectionCardProps) {
  return (
    <Card className={cn(className)} {...props}>
      {(title || description || actions) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </CardHeader>
      )}
      <CardContent className={cn(!(title || description || actions) && "pt-5")}>
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

export { SectionCard };
