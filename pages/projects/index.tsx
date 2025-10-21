import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useGetProjects } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

const Projects: NextPage = () => {
  const { data: projects = [], isLoading, error } = useGetProjects();

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Error loading projects
          </h1>
          <p className="text-muted-foreground text-lg">
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
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                My <span className="text-primary">Projects</span>
              </h1>
              <div className="ml-3 md:ml-4 h-1 w-12 md:w-16 bg-primary"></div>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
              A collection of projects I&apos;ve worked on, showcasing my skills
              and experience in software development.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No projects available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {projects.map((project) => (
                  <Card
                    key={project.slug}
                    className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-border/50 hover:border-primary/20 bg-card"
                  >
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="flex items-start gap-3 md:gap-4">
                        {project.image?.src && (
                          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden ring-2 ring-border/50 flex-shrink-0">
                            <Image
                              src={project.image.src}
                              alt={project.name || "Project"}
                              width={64}
                              height={64}
                              className="object-cover"
                              sizes="(max-width: 768px) 48px, 64px"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl lg:text-2xl group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            <Link href={`/projects/${project.slug}`}>
                              {project.name || "Untitled Project"}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-sm md:text-base font-medium text-muted-foreground mt-1">
                            {project.type || "Unknown type"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 md:pb-4">
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3">
                        {project.description || "No description available"}
                      </p>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 md:gap-4 pt-0">
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {project.technologies.slice(0, 4).map((tech) => (
                              <Badge
                                key={tech.id}
                                variant="secondary"
                                className="text-xs md:text-sm font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                              >
                                {tech.name}
                              </Badge>
                            ))}
                            {project.technologies.length > 4 && (
                              <Badge
                                variant="outline"
                                className="text-xs md:text-sm font-medium"
                              >
                                +{project.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                      <div className="flex gap-2">
                        {project.url && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            asChild
                          >
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Project
                              <ExternalLinkIcon className="w-3 h-3 md:w-4 md:h-4 ml-1.5 md:ml-2" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/projects/${project.slug}`}>
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
  );
};

export default Projects;
