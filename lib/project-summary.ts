type ProjectCopy = {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
};

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Card copy for a project. Returns null when the only text repeats the title
 * (for example ATGE and Legal Docs) so the card does not render that line twice.
 */
export function projectCardDescription(project: ProjectCopy): string | null {
  const name = normalize(project.name);
  const description = project.description?.trim() ?? "";
  const longDescription = project.longDescription?.trim() ?? "";

  if (description && normalize(description) !== name) {
    return description;
  }

  if (
    longDescription &&
    normalize(longDescription) !== name &&
    normalize(longDescription) !== normalize(description)
  ) {
    return longDescription;
  }

  return null;
}
