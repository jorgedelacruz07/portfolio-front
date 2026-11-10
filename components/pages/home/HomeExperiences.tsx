import { CompanyLogo } from "@/components/CompanyLogo";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Badge } from "@/components/ui/badge";
import {
  previewExperienceGroups,
  visibleHighlights,
} from "@/lib/experience-groups";
import { formatDateRange } from "@/lib/utils";
import type { TExperience } from "@/types/experience";

type HomeExperiencesProps = {
  experiences: TExperience[];
};

/** Four roles, one line each. Full descriptions stay on /experiences. */
export const HomeExperiences = ({ experiences }: HomeExperiencesProps) => {
  const groups = previewExperienceGroups(experiences, 4);

  return (
    <HomeSection
      index="02"
      eyebrow="Experience"
      title="A decade of shipping software"
      description="From full-stack product work to senior engineering roles across distributed teams and client engagements."
      actionHref="/experiences"
      actionLabel="Full career history"
    >
      <ol className="space-y-0">
        {groups.map((group, index) => {
          const highlight = visibleHighlights(group.sources)[0];
          const technologies = Array.from(
            new Map(
              group.sources
                .flatMap((source) => source.technologies ?? [])
                .map((technology) => [technology.name, technology]),
            ).values(),
          ).slice(0, 5);
          const location = group.logoExperience.companyFrom;

          return (
            <li
              key={group.id}
              className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 rounded-xl transition-colors hover:bg-card/55 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6"
            >
              {index < groups.length - 1 ? (
                <span
                  className="absolute bottom-0 left-5 top-12 w-px -translate-x-1/2 bg-border sm:left-6"
                  aria-hidden="true"
                />
              ) : null}

              <CompanyLogo
                experience={group.logoExperience}
                className="relative z-10 h-10 w-10 sm:h-12 sm:w-12"
              />

              <div className="flex flex-col gap-2 border-b border-border/70 pb-7 pt-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {group.jobTitle}
                    </h3>
                    {group.to === null ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-500/[0.07] px-2 py-0.5 text-[0.625rem] font-medium text-emerald-800 dark:border-emerald-400/20 dark:text-emerald-300">
                        <span
                          className="h-1 w-1 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        />
                        Current
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/85">
                      {group.companyLabel}
                    </span>
                    {location ? <span> · {location}</span> : null}
                  </p>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {highlight || group.summary || group.companyDetail}
                  </p>

                  {technologies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {technologies.map((technology) => (
                        <Badge
                          key={technology.id || technology.name}
                          variant="secondary"
                        >
                          {technology.name}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                <span className="mono-label shrink-0 text-muted-foreground sm:pt-1 sm:text-right">
                  {formatDateRange(group.from, group.to)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </HomeSection>
  );
};
