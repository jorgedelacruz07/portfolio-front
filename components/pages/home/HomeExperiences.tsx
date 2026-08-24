import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { TExperience } from "@/types/experience";
import { OptimizedImage } from "@/components/OptimizedImage";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { getCompanyMonogram, getCompanyTheme } from "@/lib/company-themes";
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
  const theme = useMemo(
    () => getCompanyTheme(experience.slug, experience.company),
    [experience.slug, experience.company],
  );

  const monogram = useMemo(
    () => getCompanyMonogram(experience.company),
    [experience.company],
  );

  return (
    <motion.div
      variants={homeMotion.item}
      className="relative flex gap-3.5 sm:gap-5 pb-6 sm:pb-7 last:pb-0 group"
    >
      {/* Continuous Vertical Timeline Track Spine */}
      {!isLast ? (
        <div
          className="absolute left-[15px] sm:left-[19px] top-7 -bottom-2 w-px bg-gradient-to-b from-primary/30 via-border/70 to-border/20 group-hover:from-primary/50 transition-colors"
          aria-hidden="true"
        />
      ) : null}

      {/* Timeline Node / Anchor */}
      <div className="relative z-10 shrink-0">
        <div
          className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-xl border shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/20 ${
            experience.image?.src ? "border-border/80 bg-card" : theme.iconBg
          }`}
        >
          {experience.image?.src ? (
            <OptimizedImage
              src={experience.image.src}
              alt={experience.company}
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            <span className="font-mono text-[0.6875rem] sm:text-xs font-bold tracking-tight">
              {monogram}
            </span>
          )}
        </div>
      </div>

      {/* Timeline Content Card */}
      <div className="craft-card craft-card-interactive flex-1 overflow-hidden rounded-2xl p-4 sm:p-5 transition-all hover:border-primary/40">
        <div className="space-y-2.5">
          {/* Header Row: Role, Company, Location & Period */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {experience.jobTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="font-semibold text-foreground/90">
                  {experience.company}
                </span>
                {experience.companyFrom ? (
                  <>
                    <span className="text-border">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-muted-foreground/70" />
                      <span>{experience.companyFrom}</span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Date Period Badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center rounded-lg border border-border/70 bg-secondary/80 px-2 py-0.5 font-mono text-[0.6875rem] font-medium text-foreground/90">
                {formatDateRange(experience.from, experience.to)}
              </span>
            </div>
          </div>

          {/* Job Description */}
          {experience.jobDescription ? (
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {experience.jobDescription}
            </p>
          ) : null}

          {/* Technology Badges */}
          {experience.technologies?.length ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {experience.technologies.map((tech) => (
                <span key={tech.id} className="craft-pill text-[0.6875rem]">
                  {tech.name}
                </span>
              ))}
            </div>
          ) : null}

          {/* Action Link */}
          {experience.companyUrl ? (
            <div className="pt-0.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 -ml-2 px-2 gap-1.5"
              >
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Company website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
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
      <div className="relative pl-1 sm:pl-2 pt-2">
        {experiences.map((experience, index) => (
          <ExperienceTimelineItem
            key={experience.id || experience.slug}
            experience={experience}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </HomeSection>
  );
};
