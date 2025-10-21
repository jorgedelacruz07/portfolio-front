import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { addHours, format } from "date-fns";
import { useGetExperiences } from "../../hooks/queries";
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

const Experiences: NextPage = () => {
  const { data: experiences = [], isLoading, error } = useGetExperiences();

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
            Error loading experiences
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
                My <span className="text-primary">Experiences</span>
              </h1>
              <div className="ml-3 md:ml-4 h-1 w-12 md:w-16 bg-primary"></div>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
              My professional journey and the experiences that have shaped my
              career in software development.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {experiences.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No experiences available at the moment.
                </p>
              </div>
            ) : (
              experiences.map((experience) => (
                <Card
                  key={experience.slug}
                  className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border-border/50 hover:border-primary/20 bg-card"
                >
                  <CardHeader className="pb-3 md:pb-4">
                    <div className="flex items-center gap-4">
                      {experience.image?.src && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border/50">
                          <Image
                            src={experience.image.src}
                            alt={experience.company || "Company"}
                            width={64}
                            height={64}
                            className="object-cover"
                            sizes="64px"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors duration-300">
                          <Link href={`/experiences/${experience.slug}`}>
                            {experience.jobTitle || "Position"}
                          </Link>
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-muted-foreground">
                          {experience.company || "Company"}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
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
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.jobDescription || "No description available"}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 md:gap-4 pt-0">
                    {experience.technologies &&
                      experience.technologies.length > 0 && (
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
                      )}

                    <div className="flex gap-2">
                      {experience.companyUrl && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                          asChild
                        >
                          <a
                            href={experience.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Company Website
                            <ExternalLinkIcon className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/experiences/${experience.slug}`}>
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
  );
};

export default Experiences;
