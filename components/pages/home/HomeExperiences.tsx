import { Link } from "react-router-dom";
import { TExperience } from "@/types/experience";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { formatDateRange, homePageStyles } from "@/lib/utils";

type HomeExperiencesProps = {
  experiences: TExperience[];
};

const ExperienceCard = ({ experience }: { experience: TExperience }) => {
  return (
    <article className={homePageStyles.spotlightCard}>
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted">
          <OptimizedImage
            src={experience.image.src}
            alt={experience.company}
            className="h-full w-full object-cover"
            width={64}
            height={64}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {formatDateRange(experience.from, experience.to)}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            <Link
              to={`/experiences/${experience.slug}`}
              className="transition-colors hover:text-primary"
            >
              {experience.company}
            </Link>
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {experience.jobTitle}
          </p>
        </div>
      </div>

      <p className="text-sm leading-7 text-muted-foreground">
        {experience.jobDescription}
      </p>

      <div className={homePageStyles.metaList}>
        {experience.technologies.slice(0, 4).map((technology) => (
          <Badge
            key={technology.id}
            variant="secondary"
            className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground"
          >
            {technology.name}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row">
        <Button
          asChild
          variant="outline"
          className="h-11 flex-1 rounded-full border-border bg-background/80 px-5 text-sm font-semibold"
        >
          <Link to={`/experiences/${experience.slug}`}>View role</Link>
        </Button>

        {experience.companyUrl ? (
          <Button
            asChild
            className="h-11 flex-1 rounded-full px-5 text-sm font-semibold"
          >
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              Company site
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
};

export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  return (
    <HomeSection
      eyebrow="Experience"
      title="Recent roles where product quality and delivery discipline mattered."
      description="A snapshot of the teams and environments where I led or contributed to scalable frontend delivery."
      actionHref="/experiences"
      actionLabel="All experience"
    >
      <div className={homePageStyles.featuredGrid}>
        {experiences.map((experience) => (
          <ExperienceCard key={experience.slug} experience={experience} />
        ))}
      </div>
    </HomeSection>
  );
};
