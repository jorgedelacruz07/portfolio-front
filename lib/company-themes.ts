export interface CompanyTheme {
  gradient: string;
  badge: string;
  border: string;
  glow: string;
  accent: string;
  iconBg: string;
}

const THEMES: Record<string, CompanyTheme> = {
  seeri: {
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    border: "group-hover:border-emerald-500/40",
    glow: "bg-emerald-500/10",
    accent: "text-emerald-400",
    iconBg:
      "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
  },
  indra: {
    gradient: "from-blue-500/20 via-sky-500/10 to-transparent",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    border: "group-hover:border-blue-500/40",
    glow: "bg-blue-500/10",
    accent: "text-blue-400",
    iconBg:
      "bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
  },
  utp: {
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    border: "group-hover:border-purple-500/40",
    glow: "bg-purple-500/10",
    accent: "text-purple-400",
    iconBg:
      "bg-gradient-to-br from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30",
  },
  joinnus: {
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    border: "group-hover:border-amber-500/40",
    glow: "bg-amber-500/10",
    accent: "text-amber-400",
    iconBg:
      "bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
  },
  mandu: {
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    border: "group-hover:border-rose-500/40",
    glow: "bg-rose-500/10",
    accent: "text-rose-400",
    iconBg:
      "bg-gradient-to-br from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30",
  },
  prodequa: {
    gradient: "from-indigo-500/20 via-cyan-500/10 to-transparent",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    border: "group-hover:border-indigo-500/40",
    glow: "bg-indigo-500/10",
    accent: "text-indigo-400",
    iconBg:
      "bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 text-indigo-400 border-indigo-500/30",
  },
};

const DEFAULT_THEME: CompanyTheme = {
  gradient: "from-primary/15 via-secondary/10 to-transparent",
  badge: "bg-primary/10 text-primary border-primary/20",
  border: "group-hover:border-primary/40",
  glow: "bg-primary/10",
  accent: "text-primary",
  iconBg:
    "bg-gradient-to-br from-secondary/80 to-muted text-primary border-border/80",
};

export function getCompanyTheme(
  slug?: string,
  companyName?: string,
): CompanyTheme {
  const key = (slug || companyName || "").toLowerCase().trim();
  for (const [themeKey, theme] of Object.entries(THEMES)) {
    if (key.includes(themeKey)) {
      return theme;
    }
  }
  return DEFAULT_THEME;
}

export function getCompanyMonogram(companyName?: string): string {
  if (!companyName) return "EX";
  const words = companyName.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return companyName.slice(0, 2).toUpperCase();
}
