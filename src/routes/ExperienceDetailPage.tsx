import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetExperienceBySlug } from "@/hooks";

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: experience, isLoading, error } = useGetExperienceBySlug(slug);

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
            Error loading experience
          </h1>
          <p className="text-lg text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link to="/experiences">Back to Experiences</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Experience not found
          </h1>
          <Button variant="outline" asChild>
            <Link to="/experiences">Back to Experiences</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${experience.jobTitle} | Jorge de la Cruz`}</title>
        <meta
          name="description"
          content={
            experience.jobDescription ||
            `${experience.jobTitle} at ${experience.company}`
          }
        />
        <meta
          property="og:title"
          content={`${experience.jobTitle} at ${experience.company} | Jorge de la Cruz`}
        />
        <meta
          property="og:description"
          content={experience.jobDescription || "Work experience details"}
        />
        {experience.image?.src && (
          <meta property="og:image" content={experience.image.src} />
        )}
        <meta
          name="twitter:title"
          content={`${experience.jobTitle} at ${experience.company} | Jorge de la Cruz`}
        />
      </Helmet>

      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="space-y-8">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                {experience.image?.src ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg ring-2 ring-border/50">
                    <OptimizedImage
                      src={experience.image.src}
                      alt={experience.company}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                    {experience.jobTitle}
                  </h1>
                  <div className="mt-2 flex items-center gap-4">
                    <h2 className="text-xl text-muted-foreground">
                      {experience.company}
                    </h2>
                    {experience.companyUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={experience.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          Visit Company
                          <ExternalLinkIcon className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
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

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {experience.jobDescription}
              </p>
            </div>

            {experience.companyDescription ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  About {experience.company}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {experience.companyDescription}
                </p>
              </div>
            ) : null}

            {experience.technologies?.length ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech) => (
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
                <Link to="/experiences" className="inline-flex items-center">
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
                  Back to Experiences
                </Link>
              </Button>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
