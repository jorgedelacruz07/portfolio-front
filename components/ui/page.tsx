import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-14", className)}>{children}</div>;
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
    <header className="max-w-4xl space-y-3 border-b border-border/80 pb-6 sm:space-y-5 sm:pb-10">
      {eyebrow ? (
        <p className="mono-label flex items-center gap-3 text-primary">
          <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold leading-[1.05] text-foreground sm:text-6xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
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
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/75 px-6 py-16 text-center shadow-sm">
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <Title className="text-lg font-semibold tracking-tight text-foreground">{title}</Title>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  );
}
