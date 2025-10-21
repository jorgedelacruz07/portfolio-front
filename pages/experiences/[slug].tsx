import Image from "next/image";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import { useGetExperienceBySlug } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

const ExperiencePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: experience, isLoading, error } = useGetExperienceBySlug(slug);

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
            Error loading experience
          </h1>
          <p className="text-muted-foreground text-lg">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link href="/experiences">Back to Experiences</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Experience not found
          </h1>
          <Button variant="outline" asChild>
            <Link href="/experiences">Back to Experiences</Link>
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
              {experience.image?.src && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-2 ring-border/50">
                  <Image
                    src={experience.image.src}
                    alt={experience.company}
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
                  {experience.jobTitle}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <h2 className="text-xl text-muted-foreground">
                    {experience.company}
                  </h2>
                  {experience.companyUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Visit Company
                        <ExternalLinkIcon className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>
                {format(new Date(experience.from), "MMMM yyyy")} -{" "}
                {experience.to
                  ? format(new Date(experience.to), "MMMM yyyy")
                  : "Present"}
              </time>
            </div>
          </header>

          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {experience.jobDescription}
            </p>
          </div>

          {/* Company Description */}
          {experience.companyDescription && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                About {experience.company}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {experience.companyDescription}
              </p>
            </div>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
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
              <Link href="/experiences" className="inline-flex items-center">
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
                Back to Experiences
              </Link>
            </Button>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default ExperiencePage;
