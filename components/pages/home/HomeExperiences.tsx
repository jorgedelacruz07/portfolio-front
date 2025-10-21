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
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border/50">
            <Image
              src={experience.image.src}
              alt={experience.company}
              width={64}
              height={64}
              sizes="(max-width: 768px) 64px, 64px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors duration-300">
              <Link href={`/experiences/${experience.slug}`}>
                {experience.company}
              </Link>
            </CardTitle>
            <CardDescription className="text-base font-medium text-muted-foreground">
              {experience.jobTitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center text-sm text-muted-foreground font-medium">
          <span>
            {experience.from} - {experience.to ? experience.to : "Present"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-0">
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
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
              onClick={handleExternalLinkClick}
              asChild
            >
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Company
                <ExternalLinkIcon className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" className="w-full" asChild>
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
        <div className="flex items-center justify-between mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
