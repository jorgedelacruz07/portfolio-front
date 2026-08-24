import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetExperiences } from "@/hooks";
import { formatDateRange } from "@/lib/utils";

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading, error } = useGetExperiences();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Error loading experiences
          </h1>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Experiences | Jorge de la Cruz</title>
        <meta
          name="description"
          content="A snapshot of professional roles, teams, and technology stacks across frontend product delivery."
        />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-3 border-b border-border/80 pb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Career
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Professional Journey & Experience
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              A comprehensive track record of software engineering roles, team
              leadership, and product delivery.
            </p>
          </div>

          <div className="space-y-6">
            {experiences.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No experiences available at the moment.
              </div>
            ) : (
              experiences.map((experience) => (
                <Card
                  key={experience.slug}
                  className="craft-card-interactive p-6"
                >
                  <CardHeader className="p-0 pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        {experience.image?.src ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            <OptimizedImage
                              src={experience.image.src}
                              alt={experience.company || "Company"}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="space-y-1">
                          <CardTitle className="text-xl transition-colors hover:text-primary">
                            <Link to={`/experiences/${experience.slug}`}>
                              {experience.jobTitle || "Position"}
                            </Link>
                          </CardTitle>
                          <CardDescription className="font-medium text-foreground/80">
                            {experience.company || "Company"}
                          </CardDescription>
                        </div>
                      </div>

                      <span className="font-mono text-xs text-muted-foreground sm:text-right shrink-0">
                        {formatDateRange(experience.from, experience.to)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {experience.jobDescription || "No description available"}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 p-0 pt-4 border-t border-border/60 sm:flex-row sm:items-center sm:justify-between">
                    {experience.technologies?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {experience.technologies.map((tech) => (
                          <span key={tech.id} className="craft-pill">
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs"
                        asChild
                      >
                        <Link to={`/experiences/${experience.slug}`}>
                          Role details
                        </Link>
                      </Button>
                      {experience.companyUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-mono text-xs"
                          asChild
                        >
                          <a
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            <span>Website</span>
                            <ExternalLinkIcon className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
