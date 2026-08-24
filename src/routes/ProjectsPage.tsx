import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProjects } from "@/hooks";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useGetProjects();

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Error loading projects
          </h1>
          <p className="text-lg text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects | Jorge de la Cruz</title>
        <meta
          name="description"
          content="A collection of projects showcasing frontend architecture, product engineering, and scalable web delivery."
        />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-3 border-b border-border/80 pb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Portfolio
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Projects & Engineering Work
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Production web applications, client products, and architecture experiments built with modern TypeScript and React.
            </p>
          </div>

          {/* Project List */}
          <div>
            {projects.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No projects available at the moment.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <Card
                    key={project.slug}
                    className="craft-card-interactive flex flex-col justify-between p-5"
                  >
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-start gap-4">
                        {project.image?.src ? (
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            <OptimizedImage
                              src={project.image.src}
                              alt={project.name || "Project"}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg transition-colors hover:text-primary">
                            <Link to={`/projects/${project.slug}`}>
                              {project.name || "Untitled Project"}
                            </Link>
                          </CardTitle>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary">
                              {project.type || "Web App"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 pb-4">
                      <CardDescription className="line-clamp-2">
                        {project.description || "No description available"}
                      </CardDescription>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 p-0 pt-3 border-t border-border/60">
                      {project.technologies?.length ? (
                        <div className="flex w-full flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span key={tech.id} className="craft-pill">
                              {tech.name}
                            </span>
                          ))}
                          {project.technologies.length > 4 ? (
                            <span className="font-mono text-[0.6875rem] text-muted-foreground self-center">
                              +{project.technologies.length - 4}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="flex w-full gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 font-mono text-xs"
                          asChild
                        >
                          <Link to={`/projects/${project.slug}`}>
                            Case study
                          </Link>
                        </Button>
                        {project.url ? (
                          <Button
                            size="sm"
                            className="flex-1 font-mono text-xs"
                            asChild
                          >
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5"
                            >
                              <span>Live demo</span>
                              <ExternalLinkIcon className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
