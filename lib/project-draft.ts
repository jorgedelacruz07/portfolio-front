export type ProjectDraftFile = {
  format: "portfolio-project-draft";
  version: 1;
  project: {
    slug: string;
    name: string;
    description: string;
    longDescription?: string;
    type?: string;
    technologyNames?: string[];
    links?: { live?: string; github?: string; caseStudy?: string };
  };
};

export function readProjectDraft(raw: string): ProjectDraftFile {
  if (new TextEncoder().encode(raw).length > 40000) throw new Error("Choose a draft smaller than 40 KB.");
  const value = JSON.parse(raw);
  const project = value?.project;
  if (
    value?.format !== "portfolio-project-draft" ||
    value.version !== 1 ||
    !project ||
    typeof project !== "object" ||
    Array.isArray(project) ||
    ["slug", "name", "description"].some((key) => typeof project[key] !== "string" || !project[key].trim()) ||
    ["longDescription", "type"].some((key) => project[key] !== undefined && typeof project[key] !== "string") ||
    (project.technologyNames !== undefined &&
      (!Array.isArray(project.technologyNames) ||
        project.technologyNames.some((name: unknown) => typeof name !== "string"))) ||
    (project.links !== undefined &&
      (!project.links ||
        typeof project.links !== "object" ||
        Array.isArray(project.links) ||
        Object.values(project.links).some((link) => typeof link !== "string")))
  )
    throw new Error("Choose a project draft JSON, not the private source report.");
  return value;
}
