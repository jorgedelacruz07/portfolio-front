import { addHours, format } from "date-fns";
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
import { useGetExperiences } from "@/hooks";

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading, error } = useGetExperiences();

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
            Error loading experiences
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
        <title>Experiences | Jorge de la Cruz</title>
        <meta
          name="description"
          content="A snapshot of professional roles, teams, and technology stacks across frontend product delivery."
        />
      </Helmet>

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 text-center md:space-y-4">
              <div className="mb-3 flex items-center justify-center md:mb-4">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                  My <span className="text-primary">Experiences</span>
                </h1>
                <div className="ml-3 h-1 w-12 bg-primary md:ml-4 md:w-16" />
              </div>
              <p className="mx-auto max-w-2xl px-4 text-base text-muted-foreground md:text-lg">
                My professional journey and the experiences that have shaped my
                career in software development.
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              {experiences.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg text-muted-foreground">
                    No experiences available at the moment.
                  </p>
                </div>
              ) : (
                experiences.map((experience) => (
                  <Card
                    key={experience.slug}
                    className="group border-border/50 bg-card transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-lg"
                  >
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="flex items-center gap-4">
                        {experience.image?.src ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg ring-2 ring-border/50">
                            <OptimizedImage
                              src={experience.image.src}
                              alt={experience.company || "Company"}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="flex-1">
                          <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary md:text-2xl">
                            <Link to={`/experiences/${experience.slug}`}>
                              {experience.jobTitle || "Position"}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-base font-medium text-muted-foreground">
                            {experience.company || "Company"}
                          </CardDescription>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {experience.from
                            ? `${format(
                                addHours(new Date(experience.from), 5),
                                "MMM yyyy",
                              )} - ${
                                experience.to
                                  ? format(
                                      addHours(new Date(experience.to), 5),
                                      "MMM yyyy",
                                    )
                                  : "Present"
                              }`
                            : "No dates available"}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 md:pb-4">
                      <p className="leading-relaxed text-muted-foreground">
                        {experience.jobDescription ||
                          "No description available"}
                      </p>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-0 md:gap-4">
                      {experience.technologies?.length ? (
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
                      ) : null}

                      <div className="flex gap-2">
                        {experience.companyUrl ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                            asChild
                          >
                            <a
                              href={experience.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Company Website
                              <ExternalLinkIcon className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        ) : null}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/experiences/${experience.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
