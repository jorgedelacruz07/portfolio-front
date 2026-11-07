import type { FC } from "react";

type PageSkeletonVariant = "listing" | "articles" | "article" | "page";

interface PageSkeletonProps {
  variant?: PageSkeletonVariant;
  className?: string;
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`motion-safe:animate-pulse rounded-lg bg-muted/70 ${className}`} aria-hidden="true" />
);

function CardSkeleton({ article = false }: { article?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50">
      {article ? <SkeletonBlock className="h-40 w-full rounded-none sm:h-48" /> : null}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-5 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        <SkeletonBlock className="h-6 w-3/4" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
        <div className="flex gap-2 pt-1">
          <SkeletonBlock className="h-6 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
          <SkeletonBlock className="hidden h-6 w-14 rounded-full sm:block" />
        </div>
      </div>
    </div>
  );
}

function ListingSkeleton({ article = false }: { article?: boolean }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <header className="space-y-4 border-b border-border/60 pb-7 sm:pb-9">
        <SkeletonBlock className="h-7 w-40 rounded-full" />
        <SkeletonBlock className="h-9 w-11/12 max-w-2xl sm:h-12" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full max-w-2xl" />
          <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-10 w-full rounded-xl sm:max-w-sm" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-16 rounded-full" />
          <SkeletonBlock className="h-9 w-20 rounded-full" />
          <SkeletonBlock className="hidden h-9 w-20 rounded-full sm:block" />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <CardSkeleton key={index} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-7 px-4 py-8 sm:px-6 sm:py-12">
      <SkeletonBlock className="h-9 w-32 rounded-full" />
      <header className="space-y-5 border-b border-border/60 pb-8">
        <SkeletonBlock className="h-10 w-full max-w-2xl sm:h-14" />
        <SkeletonBlock className="h-5 w-11/12 max-w-xl" />
        <div className="flex items-center gap-3 pt-1">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
      </header>
      <div className="space-y-4 pt-1">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-10/12" />
        <SkeletonBlock className="my-8 h-48 w-full rounded-2xl" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-11/12" />
        <SkeletonBlock className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export const PageSkeleton: FC<PageSkeletonProps> = ({ variant = "page", className }) => (
  <section className={className} aria-busy="true" aria-label="Loading page content" role="status">
    <span className="sr-only">Loading page content</span>
    {variant === "listing" ? <ListingSkeleton /> : null}
    {variant === "articles" ? <ListingSkeleton article /> : null}
    {variant === "article" ? <ArticleSkeleton /> : null}
    {variant === "page" ? <ListingSkeleton article /> : null}
  </section>
);
