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

  // Dates are stored as calendar days (YYYY-MM-DD, parsed as UTC midnight). Formatting them in the
  // viewer's zone would shift the first of a month back to the previous month west of UTC.
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateRange(from: string, to: string | null): string {
  return `${formatDateLabel(from)} - ${to ? formatDateLabel(to) : "Present"}`;
}

export const homeMotion = {
  section: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.04,
      },
    },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  } satisfies Variants,
} as const;

export const homePageStyles = {
  page: "relative mx-auto flex w-full max-w-5xl flex-col gap-10 sm:gap-12 md:gap-14 pb-8",
  section: "relative space-y-5 sm:space-y-6",
  sectionHeader: "space-y-1.5 sm:space-y-2",
  eyebrow: "font-mono text-xs font-medium uppercase tracking-widest text-primary",
  title: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  description: "max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground",
  featuredGrid: "grid gap-5 md:grid-cols-2",
  metaBadge: "craft-pill",
};
