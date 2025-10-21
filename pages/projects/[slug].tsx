import Image from "next/image";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import { useGetProjectBySlug } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

const ProjectPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: project, isLoading, error } = useGetProjectBySlug(slug);

  if (router.isFallback || isLoading) {
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
            Error loading project
          </h1>
          <p className="text-muted-foreground text-lg">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Project not found
          </h1>
          <Button variant="outline" asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              {project.image?.src && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-2 ring-border/50">
                  <Image
                    src={project.image.src}
                    alt={project.name}
                    width={80}
                    height={80}
                    className="object-cover"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {project.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  {project.type && (
                    <Badge variant="secondary" className="text-sm font-medium">
                      {project.type}
                    </Badge>
                  )}
                  {project.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Visit Project
                        <ExternalLinkIcon className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
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

          {/* Project Image */}
          {project.image?.src && (
            <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={project.image.src}
                alt={project.name}
                width={800}
                height={450}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                loading="lazy"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="text-sm font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="pt-8 border-t border-border/40">
            <Button variant="outline" asChild>
              <Link href="/projects" className="inline-flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
  );
};

export default ProjectPage;
