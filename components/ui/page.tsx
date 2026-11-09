import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="max-w-2xl space-y-3 border-b border-border pb-8">
      {eyebrow ? (
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  children,
  heading = "h2",
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  heading?: "h1" | "h2";
}) {
  const Title = heading;

  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
      {icon ? <div className="mb-4 text-muted-foreground">{icon}</div> : null}
      <Title className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </Title>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
