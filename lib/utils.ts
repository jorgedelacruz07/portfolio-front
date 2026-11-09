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
  page: "mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14",
  section: "space-y-6",
  sectionHeader: "max-w-2xl space-y-2",
  eyebrow: "text-sm text-muted-foreground",
  title: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
  description: "text-sm leading-relaxed text-muted-foreground sm:text-base",
  featuredGrid: "grid gap-4 md:grid-cols-2",
};
