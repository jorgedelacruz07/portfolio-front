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
  page: "relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-8",
  section: "relative py-4 lg:py-6",
  sectionSurface:
    "glass-panel surface-grid relative overflow-hidden rounded-[2rem] px-6 py-8 shadow-premium sm:px-8 md:px-10 md:py-10",
  sectionHeader:
    "relative z-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between",
  sectionCopy: "space-y-3",
  eyebrow:
    "text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-primary/80",
  title:
    "max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl",
  description:
    "max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8",
  sectionContent: "relative z-10 mt-8 md:mt-10",
  featuredGrid: "grid gap-6 lg:grid-cols-12",
  twoColumn:
    "relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)] lg:items-center lg:gap-12",
  spotlightCard:
    "group glass-panel relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-premium-lg lg:p-7",
  metaList: "flex flex-wrap gap-2.5",
  metaBadge:
    "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/78 backdrop-blur-md",
  ctaRow: "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
  outlineLink:
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[0.07]",
};
