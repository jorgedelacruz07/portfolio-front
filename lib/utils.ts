import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(from: string, to: string | null): string {
  return `${from} - ${to ? to : "Present"}`;
}
