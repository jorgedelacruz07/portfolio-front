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

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 text-center md:space-y-4">
              <div className="mb-3 flex items-center justify-center md:mb-4">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                  My <span className="text-primary">Projects</span>
                </h1>
                <div className="ml-3 h-1 w-12 bg-primary md:ml-4 md:w-16" />
              </div>
              <p className="mx-auto max-w-2xl px-4 text-base text-muted-foreground md:text-lg">
                A collection of projects I&apos;ve worked on, showcasing my
                skills and experience in software development.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {projects.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg text-muted-foreground">
                    No projects available at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                  {projects.map((project) => (
                    <Card
                      key={project.slug}
                      className="group border-border/50 bg-card transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-lg"
                    >
                      <CardHeader className="pb-3 md:pb-4">
                        <div className="flex items-start gap-3 md:gap-4">
                          {project.image?.src ? (
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg ring-2 ring-border/50 md:h-16 md:w-16">
                              <OptimizedImage
                                src={project.image.src}
                                alt={project.name || "Project"}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : null}

                          <div className="min-w-0 flex-1">
                            <CardTitle className="line-clamp-2 text-lg transition-colors duration-300 group-hover:text-primary md:text-xl lg:text-2xl">
                              <Link to={`/projects/${project.slug}`}>
                                {project.name || "Untitled Project"}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm font-medium text-muted-foreground md:text-base">
                              {project.type || "Unknown type"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-3 md:pb-4">
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                          {project.description || "No description available"}
                        </p>
                      </CardContent>

                      <CardFooter className="flex flex-col gap-3 pt-0 md:gap-4">
                        {project.technologies?.length ? (
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <Badge
                                key={tech.id}
                                variant="secondary"
                                className="bg-muted/50 text-xs font-medium transition-colors duration-200 hover:bg-primary/10 hover:text-primary md:text-sm"
                              >
                                {tech.name}
                              </Badge>
                            ))}
                            {project.technologies.length > 4 ? (
                              <Badge
                                variant="outline"
                                className="text-xs font-medium md:text-sm"
                              >
                                +{project.technologies.length - 4} more
                              </Badge>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="flex gap-2">
                          {project.url ? (
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                              asChild
                            >
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit Project
                                <ExternalLinkIcon className="ml-1.5 h-3 w-3 md:ml-2 md:h-4 md:w-4" />
                              </a>
                            </Button>
                          ) : null}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <Link to={`/projects/${project.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
