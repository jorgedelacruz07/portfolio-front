import { ExternalLink, FolderGit2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectCardDescription } from "@/lib/project-summary";
import { cn, formatDateRange } from "@/lib/utils";
import type { TProject } from "@/types/project";

type ProjectCardProps = {
  project: TProject;
  onSelectTech?: (name: string) => void;
  heading?: "h2" | "h3";
  className?: string;
};

export function ProjectCard({
  project,
  onSelectTech,
  heading = "h2",
  className,
}: ProjectCardProps) {
  const Title = heading;
  const displayDescription = projectCardDescription(project);
  const caseStudy =
    project.longDescription &&
    displayDescription &&
    project.longDescription.trim() !== displayDescription
      ? project.longDescription
      : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.type || "Web App"}</Badge>
            {project.featured ? <Badge>Featured</Badge> : null}
          </div>
          {project.from ? (
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatDateRange(project.from, project.to)}
            </span>
          ) : null}
        </div>

        <div className="space-y-1">
          <Title className="text-lg font-semibold tracking-tight text-foreground">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
              >
                <span>{project.name}</span>
                <ExternalLink
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              </a>
            ) : (
              project.name
            )}
          </Title>
          {project.url ? (
            <p className="font-mono text-xs text-muted-foreground">
              {formatProjectHostname(project.url)}
            </p>
          ) : null}
        </div>

        {displayDescription ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {displayDescription}
          </p>
        ) : null}

        {caseStudy ? (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-foreground">
              Read case study
            </summary>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {caseStudy}
            </p>
          </details>
        ) : null}

        {project.technologies?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) =>
              onSelectTech ? (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => onSelectTech(tech.name)}
                  className="craft-pill"
                  aria-label={`Filter by ${tech.name}`}
                >
                  {tech.name}
                </button>
              ) : (
                <span key={tech.id} className="craft-pill">
                  {tech.name}
                </span>
              ),
            )}
          </div>
        ) : null}
      </div>

      {project.url || project.links?.github || project.links?.caseStudy ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {project.url ? (
            <Button size="sm" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                Live demo
                <ExternalLink
                  className="ml-1.5 h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </a>
            </Button>
          ) : null}
          {project.links?.github ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FolderGit2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Code
              </a>
            </Button>
          ) : null}
          {project.links?.caseStudy ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.links.caseStudy}
                target="_blank"
                rel="noopener noreferrer"
              >
                Case study
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function formatProjectHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
