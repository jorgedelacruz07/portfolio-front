import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjectBySlug } from "@/hooks";
import { formatDateRange } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useGetProjectBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error instanceof Error ? "Error loading project" : "Project not found"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "The requested project could not be found."}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${project.name} | Jorge de la Cruz`}</title>
        <meta name="description" content={project.description} />
        <meta property="og:title" content={`${project.name} | Jorge de la Cruz`} />
        <meta property="og:description" content={project.description} />
        {project.image?.src && (
          <meta property="og:image" content={project.image.src} />
        )}
        <meta name="twitter:title" content={`${project.name} | Jorge de la Cruz`} />
        <meta name="twitter:description" content={project.description} />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-8">
          {/* Back link */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>←</span>
            <span>All projects</span>
          </Link>

          {/* Header */}
          <header className="space-y-4 border-b border-border/80 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{project.type || "Web App"}</Badge>
              {project.from ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDateRange(project.from, project.to)}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {project.name}
              </h1>

              {project.url ? (
                <Button size="sm" className="font-mono text-xs shrink-0" asChild>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span>Visit live project</span>
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </header>

          {/* Preview Image */}
          {project.image?.src ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted shadow-card">
              <OptimizedImage
                src={project.image.src}
                alt={project.name}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          {/* Description */}
          <div className="craft-card rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Overview & Architecture
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies?.length ? (
            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stack & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech.id} className="craft-pill text-xs">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

