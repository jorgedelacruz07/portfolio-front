import { CheckCircle2, ExternalLink, MapPin, Sparkles } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import {
  visibleHighlights,
  type ExperienceGroup,
} from "@/lib/experience-groups";
import { cn, formatDateRange } from "@/lib/utils";
import type { TExperience } from "@/types/experience";

type EmployerExperienceCardProps = {
  group: ExperienceGroup;
  heading?: "h2" | "h3";
  onSelectTech?: (name: string) => void;
  /** Home timeline already places the employer logo on the spine. */
  showLogo?: boolean;
  className?: string;
};

function HighlightList({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;

  return (
    <div className="space-y-2">
      <p className="inline-flex items-center gap-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
        <span>Key Responsibilities & Highlights</span>
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {highlights.map((highlight, index) => (
          <li
            key={`${index}-${highlight}`}
            className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-2.5 text-xs leading-relaxed text-foreground/80"
          >
            <CheckCircle2
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
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
            className="craft-pill cursor-pointer text-[0.6875rem] transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {tech.name}
          </button>
        ) : (
          <span key={tech.id} className="craft-pill text-[0.6875rem]">
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
  const showDetail =
    companyDetail &&
    companyDetail.toLowerCase() !== client.jobDescription?.trim().toLowerCase();

  return (
    <li className="rounded-xl border border-border/70 bg-background/40 p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <CompanyLogo experience={client} className="h-9 w-9" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-foreground">
              Client
            </span>
            <Heading className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {client.company}
            </Heading>
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              {formatDateRange(client.from, client.to)}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground/90">
            {client.jobTitle}
          </p>
          {client.companyFrom ? (
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>{client.companyFrom}</span>
            </p>
          ) : null}
          {showDetail ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {companyDetail}
            </p>
          ) : null}
          {client.jobDescription ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {client.jobDescription}
            </p>
          ) : null}
          <HighlightList highlights={visibleHighlights([client])} />
          <TechnologyList experience={client} onSelectTech={onSelectTech} />
          {client.companyUrl ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 h-7 gap-1.5 px-2 font-mono text-xs"
            >
              <a
                href={client.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Company website</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </Button>
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
  className,
}: EmployerExperienceCardProps) {
  const Title = heading;
  const clientHeading = heading === "h2" ? "h3" : "h4";
  const clientsLabelId = `${group.id}-clients`;
  const clientIds = new Set(
    group.clients.map((client) => client.id || client.slug),
  );
  const employerHighlights = visibleHighlights(
    group.sources.filter((source) => !clientIds.has(source.id || source.slug)),
  );

  return (
    <article className={cn("min-w-0 space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {showLogo ? (
            <CompanyLogo
              experience={group.logoExperience}
              className="h-11 w-11"
            />
          ) : null}
          <div className="min-w-0 space-y-1">
            <Title className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {group.companyLabel}
            </Title>
            <p className="text-sm font-medium text-foreground/90">
              {group.jobTitle}
            </p>
            {group.logoExperience.companyFrom ? (
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{group.logoExperience.companyFrom}</span>
              </p>
            ) : null}
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-lg border border-border/70 bg-secondary/80 px-2.5 py-1 font-mono text-xs font-medium text-foreground/90">
          {formatDateRange(group.from, group.to)}
        </span>
      </div>

      {group.summary ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          {group.summary}
        </p>
      ) : null}
      {group.companyDetail ? (
        <p className="border-l-2 border-primary/40 pl-3 font-mono text-xs text-muted-foreground">
          {group.companyDetail}
        </p>
      ) : null}
      <HighlightList highlights={employerHighlights} />

      {group.clients.length > 0 ? (
        <div className="space-y-3">
          <p
            id={clientsLabelId}
            className="font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Client engagements
          </p>
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
        </div>
      ) : null}

      {group.logoExperience.companyUrl ? (
        <div className="border-t border-border/60 pt-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 font-mono text-xs"
          >
            <a
              href={group.logoExperience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Company website</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
