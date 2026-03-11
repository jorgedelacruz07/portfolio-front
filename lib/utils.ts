import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Variants } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(from: string, to: string | null): string {
  return `${formatDateLabel(from)} - ${to ? formatDateLabel(to) : "Present"}`;
}

export const homeMotion = {
  section: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } satisfies Variants,
} as const;

export const homePageStyles = {
  page: "relative mx-auto flex w-full max-w-[92rem] flex-col gap-6 px-2 pb-12 pt-3 sm:px-4 lg:gap-8 lg:px-6 lg:pb-20 lg:pt-6",
  section: "relative py-2 lg:py-3",
  sectionSurface:
    "glass-panel surface-grid relative overflow-hidden rounded-[1.75rem] px-5 py-5 shadow-premium sm:px-6 md:px-6 md:py-6",
  sectionHeader:
    "relative z-10 grid gap-4 border-b border-white/10 pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
  sectionCopy: "space-y-2",
  eyebrow:
    "text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-primary/80",
  title:
    "max-w-4xl text-2xl font-semibold leading-none tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  description: "max-w-2xl text-sm leading-relaxed text-muted-foreground",
  sectionContent: "relative z-10 mt-5 md:mt-6",
  featuredGrid: "grid gap-4 lg:grid-cols-12",
  twoColumn: "relative z-10 grid gap-4 lg:grid-cols-12 lg:items-start",
  spotlightCard:
    "group glass-panel relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.4rem] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-premium-lg",
  metaList: "flex flex-wrap gap-2",
  metaBadge:
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/78 backdrop-blur-md",
  ctaRow: "flex flex-wrap gap-2.5",
  outlineLink:
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[0.07]",
};
