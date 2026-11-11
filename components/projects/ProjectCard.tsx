import { ChevronDown, ExternalLink, FolderGit2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { projectCardDescription } from "@/lib/project-summary";
import { safeHref } from "@/lib/safe-href";
import { cn, formatDateRange } from "@/lib/utils";
import type { TProject } from "@/types/project";

type ProjectCardProps = {
  project: TProject;
  onSelectTech?: (name: string) => void;
  heading?: "h2" | "h3";
  className?: string;
  spotlight?: boolean;
  index?: number;
};

export function ProjectCard({ project, onSelectTech, heading = "h2", className, spotlight = false }: ProjectCardProps) {
  const Title = heading;
  const displayDescription = projectCardDescription(project);
  const liveUrl = safeHref(project.url);
  const githubUrl = safeHref(project.links?.github);
  const caseStudyUrl = safeHref(project.links?.caseStudy);
  const caseStudy =
    project.longDescription && displayDescription && project.longDescription.trim() !== displayDescription
      ? project.longDescription
      : null;

  const metadata = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{project.type || "Web App"}</Badge>
        {project.featured ? <Badge>Featured</Badge> : null}
      </div>
      {project.from ? (
        <span className="mono-label text-muted-foreground">{formatDateRange(project.from, project.to)}</span>
      ) : null}
    </div>
  );

  const projectDetails = (
    <div className={cn("space-y-2", spotlight && "space-y-3")}>
      <Title
        className={cn(
          "font-bold leading-[1.05] tracking-[-0.045em] text-foreground",
          spotlight ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        )}
      >
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            <span>{project.name}</span>
            <ExternalLink
              className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
              aria-hidden="true"
            />
          </a>
        ) : (
          project.name
        )}
      </Title>
      {displayDescription ? (
        <p
          className={cn(
            "leading-relaxed text-muted-foreground",
            spotlight ? "max-w-2xl pt-1 text-base sm:text-lg" : "text-sm sm:text-[0.9375rem]",
          )}
        >
          {displayDescription}
        </p>
      ) : null}
      {caseStudy ? (
        <details className="group/case pt-1 text-sm">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 py-1 font-medium text-primary marker:hidden hover:underline [&::-webkit-details-marker]:hidden">
            Learn more
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open/case:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{caseStudy}</p>
        </details>
      ) : null}
    </div>
  );

  const technologies = project.technologies?.length ? (
    <div className="flex flex-wrap gap-1.5">
      {project.technologies.map((tech) =>
        onSelectTech ? (
          <button
            key={tech.id}
            type="button"
            onClick={() => onSelectTech(tech.name)}
            className="font-mono text-xs text-muted-foreground transition-colors after:ml-1.5 after:text-border after:content-['/'] last:after:content-none hover:text-primary"
            aria-label={`Filter by ${tech.name}`}
          >
            {tech.name}
          </button>
        ) : (
          <span
            key={tech.id}
            className="font-mono text-xs text-muted-foreground after:ml-1.5 after:content-['/'] after:text-border last:after:content-none"
          >
            {tech.name}
          </span>
        ),
      )}
    </div>
  ) : null;

  const actions =
    liveUrl || githubUrl || caseStudyUrl || project.url || project.links?.github || project.links?.caseStudy ? (
      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        {liveUrl ? (
          <Button size="sm" asChild>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Live demo
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        ) : project.url ? (
          <span className="break-all text-sm text-muted-foreground">{project.url}</span>
        ) : null}
        {githubUrl ? (
          <Button variant="outline" size="sm" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <FolderGit2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Code
            </a>
          </Button>
        ) : project.links?.github ? (
          <span className="break-all text-sm text-muted-foreground">{project.links.github}</span>
        ) : null}
        {caseStudyUrl ? (
          <Button variant="outline" size="sm" asChild>
            <a href={caseStudyUrl} target="_blank" rel="noopener noreferrer">
              Case study
            </a>
          </Button>
        ) : project.links?.caseStudy ? (
          <span className="break-all text-sm text-muted-foreground">{project.links.caseStudy}</span>
        ) : null}
      </div>
    ) : null;

  return (
    <Card
      className={cn(
        "craft-card-interactive group relative flex h-full flex-col overflow-hidden rounded-none border-x-0 border-b-0 border-t border-t-border bg-transparent shadow-none hover:border-t-primary",

        className,
      )}
    >
      <div className={cn("relative flex flex-1 flex-col gap-4 px-0 py-5 sm:py-6", spotlight && "sm:py-7")}>
        {metadata}
        {projectDetails}
        {technologies ? (
          <div className="space-y-2.5">
            <p className="mono-label text-muted-foreground">Built with</p>
            {technologies}
          </div>
        ) : null}
        <div className="mt-auto space-y-4">{actions}</div>
      </div>
    </Card>
  );
}
