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
  const summary =
    experience.jobDescription
      .split(".")
      .find((sentence) => sentence.trim())
      ?.trim() ?? experience.jobDescription;

  return (
    <motion.article
      variants={homeMotion.item}
      className={cn(homePageStyles.spotlightCard, getExperienceLayout(index))}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute right-0 top-8 h-24 w-24 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="relative h-14 w-14 overflow-hidden rounded-[1rem] border border-white/10 bg-black/20">
          <OptimizedImage
            src={experience.image.src}
            alt={experience.company}
            className="h-full w-full object-cover"
            width={56}
            height={56}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
              {formatDateRange(experience.from, experience.to)}
            </span>
            <Badge variant="secondary" className="px-2 py-0.5 text-[0.62rem]">
              {experience.jobTitle}
            </Badge>
          </div>

          <h3
            className={cn(
              "font-semibold leading-none tracking-tight text-foreground",
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

          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary.endsWith(".") ? summary : `${summary}.`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {experience.technologies.slice(0, 5).map((technology) => (
          <Badge
            key={technology.id}
            variant="secondary"
            className="px-2 py-0.5 text-[0.62rem]"
          >
            {technology.name}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <Button
          asChild
          variant="outline"
          className="h-9 px-3.5 text-sm font-semibold"
        >
          <Link to={`/experiences/${experience.slug}`}>Role</Link>
        </Button>

        {experience.companyUrl ? (
          <Button asChild className="h-9 px-3.5 text-sm font-semibold">
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              Company
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
          Teams where
          <span className="text-premium-gradient">
            {" "}
            full-stack quality shipped.
          </span>
        </>
      }
      description="Roles covering product UI, backend delivery, cloud workflows, and maintainable systems."
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
