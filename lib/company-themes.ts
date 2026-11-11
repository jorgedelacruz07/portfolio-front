export interface CompanyTheme {
  gradient: string;
  badge: string;
  border: string;
  glow: string;
  accent: string;
  iconBg: string;
}

const NEUTRAL_THEME: CompanyTheme = {
  gradient: "",
  badge: "border-border bg-muted text-foreground",
  border: "",
  glow: "",
  accent: "text-foreground",
  iconBg: "border-border bg-muted text-foreground",
};

/** Logos share one neutral surface. Per-company color themes were decorative and fought the palette. */
export function getCompanyTheme(_slug?: string, _companyName?: string): CompanyTheme {
  return NEUTRAL_THEME;
}

export function getCompanyMonogram(companyName?: string): string {
  if (!companyName) return "EX";
  const words = companyName.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return companyName.slice(0, 2).toUpperCase();
}
