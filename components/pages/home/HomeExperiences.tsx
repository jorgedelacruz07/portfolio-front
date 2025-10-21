import { memo, useMemo, useCallback } from "react";
import { TExperience } from "../../../types/experience";
import Link from "next/link";
import Image from "next/image";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";
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

type Props = {
  experiences: TExperience[];
};

// Memoized experience card component
const ExperienceCard = memo<{ experience: TExperience }>(({ experience }) => {
  const handleExternalLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card className="group h-full transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] border-border/30 hover:border-primary/40 bg-card/80 backdrop-blur-sm relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      <CardHeader className="pb-5 relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/50 transition-all duration-500 group-hover:scale-105">
            <Image
              src={experience.image.src}
              alt={experience.company}
              width={64}
              height={64}
              sizes="(max-width: 768px) 64px, 64px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-500 mb-1">
              <Link
                href={`/experiences/${experience.slug}`}
                className="hover:underline decoration-primary/50 underline-offset-2"
              >
                {experience.company}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors duration-500">
              {experience.jobTitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5 relative z-10">
        <div className="flex items-center text-sm text-muted-foreground font-medium bg-muted/20 rounded-lg px-3 py-2 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
          <svg
            className="w-4 h-4 mr-2 text-primary/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {experience.from} - {experience.to ? experience.to : "Present"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-0 relative z-10">
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, index) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 30}ms` }}
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
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:shadow-md text-sm font-medium"
              onClick={handleExternalLinkClick}
              asChild
            >
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Visit Company
                <ExternalLinkIcon className="w-3.5 h-3.5 ml-1.5 group-hover:animate-bounce" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:shadow-md text-sm font-medium"
            asChild
          >
            <Link href={`/experiences/${experience.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

ExperienceCard.displayName = "ExperienceCard";

const HomeExperiencesComponent = ({ experiences }: Props) => {
  // Memoize the sliced experiences to prevent unnecessary re-renders
  const featuredExperiences = useMemo(
    () => experiences.slice(0, 3),
    [experiences],
  );

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
          <div className="flex items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Work <span className="text-primary">Experience</span>
            </h2>
            <div className="ml-4 h-1 w-16 bg-primary"></div>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-semibold"
            asChild
          >
            <Link href="/experiences">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {featuredExperiences.map((experience) => (
            <ExperienceCard key={experience.slug} experience={experience} />
          ))}
        </div>
      </div>
    </div>
  );
};

HomeExperiencesComponent.displayName = "HomeExperiences";
const HomeExperiences = memo(HomeExperiencesComponent);
export default HomeExperiences;
