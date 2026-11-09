import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { TExperience } from "@/types/experience";
import { CompanyLogo } from "@/components/CompanyLogo";
import { EmployerExperienceCard } from "@/components/experience/EmployerExperienceCard";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { previewExperienceGroups } from "@/lib/experience-groups";
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
    <motion.div
      variants={homeMotion.item}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      {!isLast ? (
        <div
          className="absolute bottom-0 left-5 top-10 w-px bg-border"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative z-10 shrink-0">
        <CompanyLogo experience={experience} className="h-10 w-10" />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {experience.jobTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{experience.company}</span>
              {experience.companyFrom ? (
                <span className="inline-flex items-center gap-1">
                  <span aria-hidden="true"> · </span>
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {experience.companyFrom}
                </span>
              ) : null}
            </p>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatDateRange(experience.from, experience.to)}
          </span>
        </div>

        {experience.jobDescription ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {experience.jobDescription}
          </p>
        ) : null}

        {experience.technologies?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.map((tech) => (
              <span key={tech.id} className="craft-pill">
                {tech.name}
              </span>
            ))}
          </div>
        ) : null}

        {experience.companyUrl ? (
          <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2">
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Company website
              <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
};

export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  const groups = previewExperienceGroups(experiences, 3);

  return (
    <HomeSection
      eyebrow="Experience"
      title="Recent roles"
      description="Track record across product engineering, team collaboration, and full-stack software delivery."
      actionHref="/experiences"
      actionLabel="Full career history"
    >
      <div className="relative">
        {groups.map((group, index) =>
          group.clients.length > 0 ? (
            <motion.div
              key={group.id}
              variants={homeMotion.item}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index === groups.length - 1 ? null : (
                <div
                  className="absolute bottom-0 left-5 top-10 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10 shrink-0">
                <CompanyLogo
                  experience={group.logoExperience}
                  className="h-10 w-10"
                />
              </div>
              <div className="min-w-0 flex-1">
                <EmployerExperienceCard
                  group={group}
                  heading="h3"
                  showLogo={false}
                  compact
                />
              </div>
            </motion.div>
          ) : (
            <ExperienceTimelineItem
              key={group.id}
              experience={group.experience}
              isLast={index === groups.length - 1}
            />
          ),
        )}
      </div>
    </HomeSection>
  );
};
