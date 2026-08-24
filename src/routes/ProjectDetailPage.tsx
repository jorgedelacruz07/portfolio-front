import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FolderGit2 } from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjectBySlug } from "@/hooks";
import { formatDateRange } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useGetProjectBySlug(slug);

  const monogram = useMemo(() => {
    if (!project?.name) return "PR";
    const words = project.name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return project.name.slice(0, 2).toUpperCase();
  }, [project?.name]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="craft-card max-w-md w-full space-y-4 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error instanceof Error
              ? "Error loading project"
              : "Project not found"}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The requested project could not be found."}
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="font-mono text-xs mt-2"
          >
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
        <meta
          property="og:title"
          content={`${project.name} | Jorge de la Cruz`}
        />
        <meta property="og:description" content={project.description} />
        {project.image?.src && (
          <meta property="og:image" content={project.image.src} />
        )}
        <meta
          name="twitter:title"
          content={`${project.name} | Jorge de la Cruz`}
        />
        <meta name="twitter:description" content={project.description} />
      </Helmet>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-8">
          {/* Back link */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all projects</span>
          </Link>

          {/* Header */}
          <header className="space-y-4 border-b border-border/80 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-mono text-xs">
                {project.type || "Web App"}
              </Badge>
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

              <div className="flex items-center gap-2 shrink-0">
                {project.links?.github ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs gap-1.5"
                    asChild
                  >
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      <span>Source code</span>
                    </a>
                  </Button>
                ) : null}

                {project.url ? (
                  <Button
                    size="sm"
                    className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                    asChild
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Visit live project</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          {/* Preview Image or Monogram Showcase */}
          {project.image?.src ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
              <OptimizedImage
                src={project.image.src}
                alt={project.name}
                width={960}
                height={540}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[21/9] w-full items-center justify-center rounded-2xl border border-border/80 bg-gradient-to-br from-secondary/60 via-card to-background p-8 shadow-sm">
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary font-mono text-2xl font-bold shadow-sm">
                  {monogram}
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {project.type || "System Architecture"}
                </div>
              </div>
            </div>
          )}

          {/* Overview Section */}
          <div className="craft-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Overview & Architecture
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.description}
            </p>
            {project.longDescription ? (
              <div className="border-t border-border/60 pt-4 mt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Technical Specifications
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            ) : null}
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
      </main>
    </>
  );
}
