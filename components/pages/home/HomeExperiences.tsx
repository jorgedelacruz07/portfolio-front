import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TExperience } from "@/types/experience";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { cn, formatDateRange, homeMotion, homePageStyles } from "@/lib/utils";

type HomeExperiencesProps = {
  experiences: TExperience[];
};

const getExperienceLayout = (index: number) => {
  if (index === 0) {
    return "lg:col-span-7";
  }

  if (index === 1) {
    return "lg:col-span-5";
  }

  return "lg:col-span-6";
};

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: TExperience;
  index: number;
}) => {
  const isFeatured = index === 0;

  return (
    <motion.article
      variants={homeMotion.item}
      className={cn(homePageStyles.spotlightCard, getExperienceLayout(index))}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute right-0 top-8 h-28 w-28 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/20">
          <OptimizedImage
            src={experience.image.src}
            alt={experience.company}
            className="h-full w-full object-cover"
            width={64}
            height={64}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
            {formatDateRange(experience.from, experience.to)}
          </p>
          <h3
            className={cn(
              "font-semibold tracking-[-0.05em] text-foreground",
              isFeatured ? "text-3xl" : "text-2xl",
            )}
          >
            <Link
              to={`/experiences/${experience.slug}`}
              className="transition-colors hover:text-primary"
            >
              {experience.company}
            </Link>
          </h3>
          <p className="text-sm font-medium tracking-[0.02em] text-white/72">
            {experience.jobTitle}
          </p>
        </div>
      </div>

      <p
        className={cn(
          "text-sm leading-7 text-muted-foreground",
          isFeatured ? "sm:text-base sm:leading-8" : "",
        )}
      >
        {experience.jobDescription}
      </p>

      <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
          Company context
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {experience.companyDescription}
        </p>
      </div>

      <div className={homePageStyles.metaList}>
        {experience.technologies.slice(0, 5).map((technology) => (
          <Badge key={technology.id} variant="secondary">
            {technology.name}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
        <Button
          asChild
          variant="outline"
          className="h-11 flex-1 text-sm font-semibold"
        >
          <Link to={`/experiences/${experience.slug}`}>View role</Link>
        </Button>

        {experience.companyUrl ? (
          <Button asChild className="h-11 flex-1 text-sm font-semibold">
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
    </motion.article>
  );
};

export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  return (
    <HomeSection
      eyebrow="Experience"
      title={
        <>
          Recent roles where
          <span className="text-premium-gradient"> product quality </span>
          and delivery discipline mattered.
        </>
      }
      description="A snapshot of the teams and environments where I led or contributed to scalable frontend delivery."
      actionHref="/experiences"
      actionLabel="All experience"
    >
      <div className={homePageStyles.featuredGrid}>
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={experience.slug}
            experience={experience}
            index={index}
          />
        ))}
      </div>
    </HomeSection>
  );
};
