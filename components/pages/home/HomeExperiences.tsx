import { motion } from "framer-motion";

import { CompanyLogo } from "@/components/CompanyLogo";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { previewExperienceGroups } from "@/lib/experience-groups";
import { formatDateRange, homeMotion } from "@/lib/utils";
import type { TExperience } from "@/types/experience";

type HomeExperiencesProps = {
  experiences: TExperience[];
};

/** Three roles, one line each. Full descriptions stay on /experiences. */
export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  const groups = previewExperienceGroups(experiences, 3);

  return (
    <HomeSection
      eyebrow="Experience"
      title="Recent roles"
      actionHref="/experiences"
      actionLabel="Full career history"
    >
      <ul className="divide-y divide-border border-y border-border">
        {groups.map((group) => (
          <motion.li
            key={group.id}
            variants={homeMotion.item}
            className="flex items-center gap-3 py-3"
          >
            <CompanyLogo
              experience={group.logoExperience}
              className="h-8 w-8"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {group.jobTitle}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {group.companyLabel}
              </p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {formatDateRange(group.from, group.to)}
            </span>
          </motion.li>
        ))}
      </ul>
    </HomeSection>
  );
};
