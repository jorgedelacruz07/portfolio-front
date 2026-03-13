import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjectBySlug } from "@/hooks";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useGetProjectBySlug(slug);

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
            Error loading project
          </h1>
          <p className="text-lg text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Project not found
          </h1>
          <Button variant="outline" asChild>
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

      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="space-y-8">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                {project.image?.src ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg ring-2 ring-border/50">
                    <OptimizedImage
                      src={project.image.src}
                      alt={project.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                    {project.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-4">
                    {project.type ? (
                      <Badge
                        variant="secondary"
                        className="text-sm font-medium"
                      >
                        {project.type}
                      </Badge>
                    ) : null}
                    {project.url ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          Visit Project
                          <ExternalLinkIcon className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time>
                  {format(new Date(project.from), "MMMM yyyy")} -{" "}
                  {project.to
                    ? format(new Date(project.to), "MMMM yyyy")
                    : "Present"}
                </time>
              </div>
            </header>

            {project.image?.src ? (
              <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                <OptimizedImage
                  src={project.image.src}
                  alt={project.name}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>

            {project.technologies?.length ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      className="bg-muted/50 text-sm font-medium transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <footer className="border-t border-border/40 pt-8">
              <Button variant="outline" asChild>
                <Link to="/projects" className="inline-flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Projects
                </Link>
              </Button>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
