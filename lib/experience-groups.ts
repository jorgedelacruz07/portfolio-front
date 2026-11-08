import type { TExperience } from "../types/experience";

/**
 * Encora and Coforge are one employer: Jorge joined Encora in December 2022, and
 * Encora became Coforge in May 2026. GoDaddy and OPIS are client engagements
 * inside that employment. Other companies stay standalone roles.
 * Grouping is derived from the current public payload, so the CMS schema can stay as it is.
 */

export type ExperienceGroup = {
  id: string;
  companyLabel: string;
  jobTitle: string;
  from: string;
  to: string | null;
  /** Factual employer framing. Null for a standalone role. */
  summary: string | null;
  companyDetail: string | null;
  logoExperience: TExperience;
  clients: TExperience[];
  sources: TExperience[];
  experience: TExperience;
};

function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isCoforge(experience: TExperience): boolean {
  const slug = normalize(experience.slug);
  const company = normalize(experience.company);
  return slug === "coforge" || company === "coforge";
}

function isEncora(experience: TExperience): boolean {
  const slug = normalize(experience.slug);
  const company = normalize(experience.company);
  return slug === "encora" || company === "encora";
}

export function isEncoraCoforgeEmployer(experience: TExperience): boolean {
  return isCoforge(experience) || isEncora(experience);
}

export function isEncoraCoforgeClient(experience: TExperience): boolean {
  const slug = normalize(experience.slug);
  const company = normalize(experience.company);
  return (
    slug.includes("godaddy") ||
    company.includes("godaddy") ||
    slug.includes("opis") ||
    company.includes("opis")
  );
}

function monthYear(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function earliestFrom(items: readonly TExperience[]): string {
  return items.map((item) => item.from).sort()[0] ?? "";
}

function latestTo(items: readonly TExperience[]): string | null {
  if (items.some((item) => !item.to)) return null;
  const dates = items
    .map((item) => item.to)
    .filter((value): value is string => Boolean(value));
  dates.sort();
  return dates[dates.length - 1] ?? null;
}

function byStartDescending(a: TExperience, b: TExperience): number {
  return a.from < b.from ? 1 : a.from > b.from ? -1 : 0;
}

function employerSummary(
  encora: TExperience | undefined,
  coforge: TExperience | undefined,
): string | null {
  if (encora && coforge) {
    return `Employer since ${monthYear(encora.from)}. Encora became Coforge in ${monthYear(coforge.from)}.`;
  }
  return null;
}

function buildEmployerGroup(
  employers: TExperience[],
  clients: TExperience[],
): ExperienceGroup {
  const encora = employers.find(isEncora);
  const coforge = employers.find(isCoforge);
  const current =
    coforge ?? employers.find((item) => !item.to) ?? employers[0] ?? clients[0];
  if (!current) {
    throw new Error(
      "Employer group requires an Encora, Coforge, or client record",
    );
  }
  const dated = employers.length > 0 ? employers : clients;
  const detailSource = coforge ?? encora;

  return {
    id: "employer-coforge-encora",
    companyLabel: "Coforge (formerly Encora)",
    jobTitle: current.jobTitle,
    from: earliestFrom(dated),
    to: latestTo(dated),
    summary: employerSummary(encora, coforge),
    companyDetail: detailSource?.companyDescription?.trim() || null,
    logoExperience: current,
    clients: [...clients].sort(byStartDescending),
    sources: [...employers, ...clients],
    experience: current,
  };
}

function buildRoleGroup(experience: TExperience): ExperienceGroup {
  return {
    id: experience.id || experience.slug,
    companyLabel: experience.company,
    jobTitle: experience.jobTitle,
    from: experience.from,
    to: experience.to,
    summary: null,
    companyDetail: experience.companyDescription?.trim() || null,
    logoExperience: experience,
    clients: [],
    sources: [experience],
    experience,
  };
}

export function groupExperiences(
  experiences: readonly TExperience[],
): ExperienceGroup[] {
  const employers = experiences.filter(isEncoraCoforgeEmployer);
  const clients = experiences.filter(
    (experience) =>
      !isEncoraCoforgeEmployer(experience) && isEncoraCoforgeClient(experience),
  );
  const consumed = new Set(
    [...employers, ...clients].map(
      (experience) => experience.id || experience.slug,
    ),
  );
  const groups: ExperienceGroup[] = [];
  let placedEmployer = false;

  for (const experience of experiences) {
    if (consumed.has(experience.id || experience.slug)) {
      if (!placedEmployer) {
        groups.push(buildEmployerGroup(employers, clients));
        placedEmployer = true;
      }
      continue;
    }
    groups.push(buildRoleGroup(experience));
  }

  if (!placedEmployer && (employers.length > 0 || clients.length > 0)) {
    groups.push(buildEmployerGroup(employers, clients));
  }

  return groups;
}

export function previewExperienceGroups(
  experiences: readonly TExperience[],
  limit = 3,
): ExperienceGroup[] {
  return groupExperiences(experiences).slice(0, limit);
}

export function experienceMatchesQuery(
  experience: TExperience,
  query: string,
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    experience.company,
    experience.jobTitle,
    experience.jobDescription,
    experience.companyDescription,
    experience.companyFrom,
    ...(experience.technologies ?? []).map((technology) => technology.name),
    ...(experience.highlights ?? []),
  ]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

export function experienceGroupMatches(
  group: ExperienceGroup,
  query: string,
  selectedTech?: string | null,
): boolean {
  if (selectedTech) {
    const tech = selectedTech.toLowerCase();
    const hasTech = group.sources.some((experience) =>
      experience.technologies?.some(
        (technology) => technology.name.toLowerCase() === tech,
      ),
    );
    if (!hasTech) return false;
  }

  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  if (group.companyLabel.toLowerCase().includes(needle)) return true;
  if (group.summary?.toLowerCase().includes(needle)) return true;
  if (group.jobTitle.toLowerCase().includes(needle)) return true;
  if (group.companyDetail?.toLowerCase().includes(needle)) return true;
  return group.sources.some((experience) =>
    experienceMatchesQuery(experience, needle),
  );
}
