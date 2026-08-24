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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  } satisfies Variants,
} as const;

export const homePageStyles = {
  page: "relative mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-8 sm:px-6 md:py-16 md:gap-24",
  section: "relative space-y-8",
  sectionHeader: "space-y-3",
  eyebrow:
    "font-mono text-xs font-medium uppercase tracking-widest text-primary",
  title:
    "text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl",
  description: "max-w-2xl text-base leading-relaxed text-muted-foreground",
  featuredGrid: "grid gap-6 md:grid-cols-2",
  metaBadge: "craft-pill",
};
