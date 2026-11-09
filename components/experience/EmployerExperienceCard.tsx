import { CheckCircle2, ExternalLink, MapPin } from "lucide-react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import {
  visibleHighlights,
  type ExperienceGroup,
} from "@/lib/experience-groups";
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

function HighlightList({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        Key responsibilities
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {highlights.map((highlight, index) => (
          <li
            key={`${index}-${highlight}`}
            className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
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
            className={badgeVariants({ variant: "secondary" })}
          >
            {tech.name}
          </button>
        ) : (
          <span
            key={tech.id}
            className={badgeVariants({ variant: "secondary" })}
          >
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
  const companyHref = safeHref(client.companyUrl);

  return (
    <li className="rounded-xl border border-border/70 bg-background/40 p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <CompanyLogo experience={client} className="h-9 w-9" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              Client
            </span>
            <Heading className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {client.company}
            </Heading>
            <span className="text-xs tabular-nums text-muted-foreground">
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
          {companyHref ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 px-2"
            >
              <a href={companyHref} target="_blank" rel="noopener noreferrer">
                <span>Company website</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </Button>
          ) : client.companyUrl ? (
            <p className="break-all text-sm text-muted-foreground">
              {client.companyUrl}
            </p>
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
  const clientIds = new Set(
    group.clients.map((client) => client.id || client.slug),
  );
  const employerHref = safeHref(group.logoExperience.companyUrl);
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
            <Title className="text-lg font-semibold tracking-tight text-foreground">
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
        <span className="w-fit text-xs tabular-nums text-muted-foreground">
          {formatDateRange(group.from, group.to)}
        </span>
      </div>

      {group.summary ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          {group.summary}
        </p>
      ) : null}
      {group.companyDetail ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {group.companyDetail}
        </p>
      ) : null}
      {compact ? null : <HighlightList highlights={employerHighlights} />}

      {group.clients.length > 0 ? (
        <div className="space-y-3">
          <p
            id={clientsLabelId}
            className="text-sm font-medium text-foreground"
          >
            Client engagements
          </p>
          {compact ? (
            <ul className="space-y-2" aria-labelledby={clientsLabelId}>
              {group.clients.map((client) => (
                <li
                  key={client.id || client.slug}
                  className="text-sm text-muted-foreground"
                >
                  <span className="font-medium text-foreground">
                    {client.company}
                  </span>
                  <span>
                    {" "}
                    · {client.jobTitle} ·{" "}
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
        <div className="border-t border-border/60 pt-3">
          <Button asChild variant="outline" size="sm">
            <a href={employerHref} target="_blank" rel="noopener noreferrer">
              <span>Company website</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      ) : group.logoExperience.companyUrl ? (
        <p className="break-all border-t border-border/60 pt-3 text-sm text-muted-foreground">
          {group.logoExperience.companyUrl}
        </p>
      ) : null}
    </article>
  );
}
