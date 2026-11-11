import { ExternalLink, MapPin } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { visibleHighlights, type ExperienceGroup } from "@/lib/experience-groups";
import { safeHref } from "@/lib/safe-href";
import { cn, formatDateRange } from "@/lib/utils";
import type { TExperience } from "@/types/experience";

type EmployerExperienceCardProps = {
  group: ExperienceGroup;
  heading?: "h2" | "h3";
  onSelectTech?: (name: string) => void;
  /** Home timeline already places the employer logo on the spine. */
  showLogo?: boolean;
  /** Home preview omits highlights and long client write-ups. The full page keeps them. */
  compact?: boolean;
  className?: string;
};

function LocationLabel({ location, className }: { location: string; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{location}</span>
    </p>
  );
}

function HighlightList({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;

  return (
    <div className="space-y-3">
      <p className="mono-label text-muted-foreground">Key responsibilities</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {highlights.map((highlight, index) => (
          <li
            key={`${index}-${highlight}`}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechnologyList({
  experience,
  onSelectTech,
}: {
  experience: TExperience;
  onSelectTech?: (name: string) => void;
}) {
  if (!experience.technologies?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {experience.technologies.map((tech) =>
        onSelectTech ? (
          <button
            key={tech.id}
            type="button"
            onClick={() => onSelectTech(tech.name)}
            aria-label={`Filter by ${tech.name}`}
            className={badgeVariants({ variant: "secondary" })}
          >
            {tech.name}
          </button>
        ) : (
          <span key={tech.id} className={badgeVariants({ variant: "secondary" })}>
            {tech.name}
          </span>
        ),
      )}
    </div>
  );
}

function ClientEngagement({
  client,
  heading,
  onSelectTech,
}: {
  client: TExperience;
  heading: "h3" | "h4";
  onSelectTech?: (name: string) => void;
}) {
  const Heading = heading;
  const companyDetail = client.companyDescription?.trim();
  const showDetail = companyDetail && companyDetail.toLowerCase() !== client.jobDescription?.trim().toLowerCase();
  const companyHref = safeHref(client.companyUrl);

  return (
    <li className="relative rounded-xl border border-border/70 bg-background/50 p-4 transition-colors hover:border-primary/25 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <CompanyLogo experience={client} className="h-9 w-9 shrink-0" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="rounded border border-border/80 bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Client
              </span>
              <Heading className="text-base font-semibold tracking-[-0.02em] text-foreground">{client.company}</Heading>
            </div>
            <span className="mono-label shrink-0 text-muted-foreground">{formatDateRange(client.from, client.to)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-medium text-foreground/90">{client.jobTitle}</p>
            {client.companyFrom ? <LocationLabel location={client.companyFrom} /> : null}
          </div>

          {showDetail ? <p className="text-xs leading-relaxed text-muted-foreground">{companyDetail}</p> : null}
          {client.jobDescription ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{client.jobDescription}</p>
          ) : null}
          <HighlightList highlights={visibleHighlights([client])} />
          <TechnologyList experience={client} onSelectTech={onSelectTech} />
          {companyHref ? (
            <a
              href={companyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover-underline"
            >
              <span>Company website</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ) : client.companyUrl ? (
            <p className="break-all text-sm text-muted-foreground">{client.companyUrl}</p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function EmployerExperienceCard({
  group,
  heading = "h2",
  onSelectTech,
  showLogo = true,
  compact = false,
  className,
}: EmployerExperienceCardProps) {
  const Title = heading;
  const clientHeading = heading === "h2" ? "h3" : "h4";
  const clientsLabelId = `${group.id}-clients`;
  const clientIds = new Set(group.clients.map((client) => client.id || client.slug));
  const employerHref = safeHref(group.logoExperience.companyUrl);
  const employerHighlights = visibleHighlights(
    group.sources.filter((source) => !clientIds.has(source.id || source.slug)),
  );
  const isCurrent = group.to === null;
  const location = group.logoExperience.companyFrom;

  return (
    <article className={cn("min-w-0 space-y-5", className)}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-start gap-4">
          {showLogo ? <CompanyLogo experience={group.logoExperience} className="h-11 w-11 shrink-0" /> : null}
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Title className="text-xl font-bold leading-tight tracking-[-0.03em] text-foreground sm:text-2xl">
                {group.companyLabel}
              </Title>
              {isCurrent ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-500/[0.07] px-2 py-0.5 text-[0.625rem] font-medium text-emerald-800 dark:border-emerald-400/20 dark:text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden="true" />
                  Current
                </span>
              ) : null}
            </div>
            <p className="text-sm font-medium text-foreground/90">{group.jobTitle}</p>
            {location ? <LocationLabel location={location} /> : null}
          </div>
        </div>
        <span className="mono-label shrink-0 text-muted-foreground sm:pt-1.5 sm:text-right">
          {formatDateRange(group.from, group.to)}
        </span>
      </header>

      {group.summary ? <p className="text-sm leading-relaxed text-muted-foreground">{group.summary}</p> : null}
      {group.companyDetail ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{group.companyDetail}</p>
      ) : null}
      {compact ? null : <HighlightList highlights={employerHighlights} />}

      {group.clients.length > 0 ? (
        <div className="space-y-4 border-t border-border/70 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p id={clientsLabelId} className="mono-label text-muted-foreground">
              Client engagements
            </p>
            <span className="mono-label text-muted-foreground/70">{String(group.clients.length).padStart(2, "0")}</span>
          </div>
          {compact ? (
            <ul className="space-y-2" aria-labelledby={clientsLabelId}>
              {group.clients.map((client) => (
                <li
                  key={client.id || client.slug}
                  className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground"
                >
                  <span className="font-medium text-foreground">{client.company}</span>
                  <span className="text-muted-foreground/70">·</span>
                  <span>{client.jobTitle}</span>
                  <span className="mono-label ml-auto text-muted-foreground/80">
                    {formatDateRange(client.from, client.to)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3" aria-labelledby={clientsLabelId}>
              {group.clients.map((client) => (
                <ClientEngagement
                  key={client.id || client.slug}
                  client={client}
                  heading={clientHeading}
                  onSelectTech={onSelectTech}
                />
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {employerHref ? (
        <div className="border-t border-border/70 pt-4">
          <Button asChild variant="outline" size="sm">
            <a href={employerHref} target="_blank" rel="noopener noreferrer">
              <span>Visit {group.companyLabel}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      ) : group.logoExperience.companyUrl ? (
        <p className="break-all border-t border-border/70 pt-4 text-sm text-muted-foreground">
          {group.logoExperience.companyUrl}
        </p>
      ) : null}
    </article>
  );
}
