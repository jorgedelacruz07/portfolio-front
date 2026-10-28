import type { TProject } from "../types/project";

/** CMS featured choices and editorial order apply consistently on Home and Projects. */
export function orderPublicProjects(projects: TProject[]): TProject[] {
  return [...projects].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    return featured || (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
}
