import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Briefcase, ExternalLink, MapPin, X } from "lucide-react";

import { PageSkeleton } from "@/components/PageSkeleton";
import { CompanyLogo } from "@/components/CompanyLogo";
import { EmployerExperienceCard } from "@/components/experience/EmployerExperienceCard";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import { SearchField } from "@/components/ui/search-field";
import { useGetExperiences } from "@/hooks";
import {
  experienceGroupMatches,
  groupExperiences,
} from "@/lib/experience-groups";
import { listView } from "@/lib/list-state";
import { safeHref } from "@/lib/safe-href";
import { formatDateRange } from "@/lib/utils";
import type { TExperience } from "@/types/experience";

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading, error } = useGetExperiences();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const allTechnologies = useMemo(() => {
    const techCounts = new Map<string, number>();
    for (const experience of experiences) {
      for (const technology of experience.technologies || []) {
        techCounts.set(
          technology.name,
          (techCounts.get(technology.name) || 0) + 1,
        );
      }
    }
    return Array.from(techCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [experiences]);

  const groups = useMemo(() => groupExperiences(experiences), [experiences]);
  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      experienceGroupMatches(group, searchQuery, selectedTech),
    );
  }, [groups, selectedTech, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedTech !== null;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTech(null);
  };

  if (isLoading) {
    return <PageSkeleton variant="listing" />;
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          heading="h1"
          icon={<X className="h-5 w-5" />}
          title="Error loading experiences"
          description={
            error instanceof Error
              ? error.message
              : "Unable to retrieve professional experience history."
          }
        >
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Try again
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Professional Experience & Career History | Jorge de la Cruz
        </title>
        <meta
          name="description"
          content="Track record across software engineering roles, team collaboration, system architecture, and product delivery."
        />
        <meta
          property="og:title"
          content="Professional Experience | Jorge de la Cruz"
        />
        <meta
          property="og:description"
          content="Track record of software engineering roles, team leadership, and product delivery."
        />
      </Helmet>

      <PageContainer className="space-y-10">
        <PageHeader
          eyebrow={`${groups.length} positions`}
          title="Professional Journey & Trajectory"
          description="A comprehensive history of engineering positions, distributed collaborations, architectural milestones, and scalable web delivery."
        />

        <section
          aria-label="Experience search and filters"
          className="space-y-4"
        >
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search experiences"
            placeholder="Search by company, client, role title, location, or stack..."
          />
          {allTechnologies.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm text-muted-foreground">Stack</span>
              {allTechnologies.map((tech) => {
                const isSelected =
                  selectedTech?.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={tech}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTech(isSelected ? null : tech)}
                    className={badgeVariants({
                      variant: isSelected ? "default" : "secondary",
                    })}
                  >
                    {tech}
                  </button>
                );
              })}
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto text-sm text-primary hover:underline"
                >
                  Reset filters
                </button>
              ) : null}
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredGroups.length}
            </span>{" "}
            of {groups.length} positions
          </p>
        </section>

        {listView(groups.length, filteredGroups.length) === "empty" ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No experiences yet"
            description="Published roles will show up here."
          />
        ) : listView(groups.length, filteredGroups.length) === "no-results" ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="No matching career experiences"
            description="No roles matched your active search query or technology filter. Try adjusting your search terms."
          >
            <Button onClick={resetFilters} variant="outline" size="sm">
              Clear all filters
            </Button>
          </EmptyState>
        ) : (
          <ol className="space-y-10">
            {filteredGroups.map((group, index) => (
              <li
                key={group.id}
                className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4"
              >
                {index < filteredGroups.length - 1 ? (
                  <span
                    className="absolute bottom-[-2.5rem] left-5 top-12 w-px -translate-x-1/2 bg-border"
                    aria-hidden="true"
                  />
                ) : null}
                <CompanyLogo
                  experience={group.logoExperience}
                  className="relative z-10 h-10 w-10"
                />
                <div className="min-w-0 rounded-lg border border-border bg-card p-5">
                  {group.clients.length > 0 ? (
                    <EmployerExperienceCard
                      group={group}
                      heading="h2"
                      showLogo={false}
                      onSelectTech={setSelectedTech}
                    />
                  ) : (
                    <ExperienceEntry
                      experience={group.experience}
                      onSelectTech={setSelectedTech}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </PageContainer>
    </>
  );
}

function ExperienceEntry({
  experience,
  onSelectTech,
}: {
  experience: TExperience;
  onSelectTech: (tech: string) => void;
}) {
  return (
    <article className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {experience.jobTitle}
          </h2>
          <p className="text-sm text-foreground">
            {experience.company}
            {experience.companyFrom ? (
              <span className="text-muted-foreground">
                {" "}
                · <MapPin
                  className="inline h-3.5 w-3.5"
                  aria-hidden="true"
                />{" "}
                {experience.companyFrom}
              </span>
            ) : null}
          </p>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatDateRange(experience.from, experience.to)}
        </span>
      </div>

      {experience.companyDescription ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {experience.companyDescription}
        </p>
      ) : null}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {experience.jobDescription || "No role description provided."}
      </p>

      {experience.highlights?.length ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Key responsibilities
          </h3>
          <ul className="space-y-2">
            {experience.highlights.map((highlight) => (
              <li
                key={highlight}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {experience.technologies?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {experience.technologies.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => onSelectTech(tech.name)}
                className={badgeVariants({ variant: "secondary" })}
                aria-label={`Filter by ${tech.name}`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        {experience.companyUrl ? (
          safeHref(experience.companyUrl) ? (
            <Button variant="outline" size="sm" asChild>
              <a
                href={safeHref(experience.companyUrl) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                Company website
                <ExternalLink
                  className="ml-1.5 h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </a>
            </Button>
          ) : (
            <p className="break-all text-sm text-muted-foreground">
              {experience.companyUrl}
            </p>
          )
        ) : null}
      </div>
    </article>
  );
}
