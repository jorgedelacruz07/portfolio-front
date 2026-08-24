import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TExperience } from "@/types/experience";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { formatDateRange, homeMotion } from "@/lib/utils";

type HomeExperiencesProps = {
  experiences: TExperience[];
};

const ExperienceTimelineItem = ({
  experience,
  isLast,
}: {
  experience: TExperience;
  isLast: boolean;
}) => {
  return (
    <motion.article
      variants={homeMotion.item}
      className="relative flex gap-6 pb-8 last:pb-0"
    >
      {/* Timeline line and bullet */}
      <div className="relative flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
          {experience.image?.src ? (
            <OptimizedImage
              src={experience.image.src}
              alt={experience.company}
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            <span className="font-mono text-xs font-semibold text-primary">
              {experience.company.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        {!isLast ? (
          <div className="w-px flex-1 bg-border/60 my-2" aria-hidden="true" />
        ) : null}
      </div>

      {/* Content */}
      <div className="craft-card craft-card-interactive flex-1 rounded-xl p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              <Link
                to={`/experiences/${experience.slug}`}
                className="transition-colors hover:text-primary"
              >
                {experience.jobTitle}
              </Link>
            </h3>
            <p className="text-sm font-medium text-foreground/80">
              {experience.company}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground sm:text-right">
            {formatDateRange(experience.from, experience.to)}
          </span>
        </div>

        {experience.jobDescription ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {experience.jobDescription}
          </p>
        ) : null}

        {experience.technologies?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            {experience.technologies.map((tech) => (
              <span key={tech.id} className="craft-pill">
                {tech.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="font-mono text-xs"
          >
            <Link to={`/experiences/${experience.slug}`}>View details</Link>
          </Button>
          {experience.companyUrl ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <span>Website</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
};

export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  return (
    <HomeSection
      eyebrow="Career Journey"
      title="Professional work & trajectory"
      description="Track record across product engineering, team collaboration, and full-stack software delivery."
      actionHref="/experiences"
      actionLabel="Full career history"
    >
      <div className="space-y-2 pt-2">
        {experiences.map((experience, index) => (
          <ExperienceTimelineItem
            key={experience.slug}
            experience={experience}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </HomeSection>
  );
};
