import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(from: string, to: string | null): string {
  return `${from} - ${to ? to : "Present"}`;
}

export const homePageStyles = {
  page: "mx-auto flex w-full max-w-6xl flex-col gap-12 pb-16 pt-4 md:gap-16 md:pb-24 md:pt-8",
  section: "relative py-12 md:py-16",
  sectionSurface:
    "rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 shadow-soft backdrop-blur sm:px-8 md:px-10 md:py-10",
  sectionHeader:
    "flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between",
  sectionCopy: "space-y-3",
  eyebrow: "text-xs font-semibold uppercase tracking-[0.28em] text-primary/80",
  title:
    "max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl",
  description: "max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base",
  sectionContent: "mt-8 md:mt-10",
  featuredGrid: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  twoColumn:
    "grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center",
  spotlightCard:
    "relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/95 p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft-lg",
  metaList: "flex flex-wrap gap-2",
  metaBadge:
    "inline-flex items-center rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium text-primary",
  ctaRow: "flex flex-col gap-3 sm:flex-row",
  outlineLink:
    "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary",
};
