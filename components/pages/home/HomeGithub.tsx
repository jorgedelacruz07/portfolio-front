import { useMemo } from "react";
import { ArrowUpRight, GitBranch } from "lucide-react";

import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { useGithubStats } from "@/hooks";
import { cn } from "@/lib/utils";
import { safeHref } from "@/lib/safe-href";
import type { TGithubCalendarWeek } from "@/types/github";
import type { TSiteCopy } from "@/lib/site-copy";

const numberFormat = new Intl.NumberFormat("en");
const contributionLevels = [
  "bg-muted",
  "bg-emerald-500/20 dark:bg-emerald-400/20",
  "bg-emerald-500/40 dark:bg-emerald-400/40",
  "bg-emerald-500/65 dark:bg-emerald-400/65",
  "bg-emerald-500/90 dark:bg-emerald-400/90",
];

/** Pad partial calendar weeks so every column contains seven days. */
function buildCells(weeks: TGithubCalendarWeek[]): Array<number | null> {
  return weeks.flatMap((week) => {
    const offset = new Date(`${week.date}T00:00:00Z`).getUTCDay();
    const cells: Array<number | null> = [...Array<null>(offset).fill(null), ...week.counts];
    while (cells.length < 7) cells.push(null);
    return cells;
  });
}

/** Adapt contribution colors to the activity range in this snapshot. */
function levelForCells(cells: Array<number | null>) {
  const active = cells.filter((count): count is number => count !== null && count > 0).sort((a, b) => a - b);
  const threshold = (ratio: number) => active[Math.min(active.length - 1, Math.floor(active.length * ratio))] ?? 1;
  const [q1, q2, q3] = [threshold(0.25), threshold(0.5), threshold(0.75)];

  return (count: number) => {
    if (count <= 0) return 0;
    if (count <= q1) return 1;
    if (count <= q2) return 2;
    if (count <= q3) return 3;
    return 4;
  };
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="px-4 py-5 sm:px-5">
      <p className="mono-label text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

export const HomeGithub = ({ copy }: { copy: TSiteCopy }) => {
  const { data, isError, isFetching, refetch } = useGithubStats();
  const cells = useMemo(() => (data?.calendar ? buildCells(data.calendar) : []), [data?.calendar]);
  const levelOf = useMemo(() => levelForCells(cells), [cells]);

  if (isError) {
    return (
      <HomeSection
        index="04"
        eyebrow={copy["home.github.eyebrow"]}
        title={copy["home.github.title"]}
        description={copy["home.github.errorDescription"]}
      >
        <Button type="button" variant="outline" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? copy["home.github.refreshing"] : copy["home.github.retry"]}
        </Button>
      </HomeSection>
    );
  }

  if (!data?.contributions) return null;

  const { contributions, streaks, repositories, languages } = data;
  const profileUrl = safeHref(data.url);
  const updated = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(data.updatedAt));

  return (
    <HomeSection
      id="github-activity"
      index="04"
      eyebrow={copy["home.github.eyebrow"]}
      title={copy["home.github.title"]}
      description={copy["home.github.description"]}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {copy["home.github.updated"]} {updated}{" "}
          <span className="mx-1.5 text-border" aria-hidden="true">
            ·
          </span>
          {copy["home.github.privateRepos"]}
        </p>
        {profileUrl ? (
          <Button asChild variant="outline" size="sm">
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <GitBranch className="mr-2 h-4 w-4" aria-hidden="true" />
              {copy["home.github.viewProfile"]}
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/80 bg-card/60 sm:grid-cols-4 sm:divide-y-0">
        <Stat
          label={copy["home.github.contributions"]}
          value={numberFormat.format(contributions.lastYear)}
          note={copy["home.github.lastYearLabel"].replace("{count}", numberFormat.format(contributions.private))}
        />
        <Stat
          label={copy["home.github.currentStreak"]}
          value={streaks ? `${streaks.current} ${copy["home.github.daysSuffix"]}` : "–"}
          note={
            streaks
              ? copy["home.github.personalBest"].replace("{count}", String(streaks.longest))
              : copy["home.github.streakFallback"]
          }
        />
        <Stat
          label={copy["home.github.repositories"]}
          value={numberFormat.format(repositories.total)}
          note={
            repositories.activeLast30Days === null
              ? copy["home.github.accountRepos"]
              : copy["home.github.activeThisMonth"].replace("{count}", String(repositories.activeLast30Days))
          }
        />
        <Stat label="Followers" value={numberFormat.format(data.followers)} note={`${data.following} following`} />
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(15rem,0.8fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium text-foreground">Contribution activity</h3>
            <span className="text-xs text-muted-foreground">Last 12 months</span>
          </div>
          {cells.length ? (
            <>
              <div
                className="mt-4 overflow-x-auto pb-2"
                role="img"
                aria-label={`Contribution calendar for the last 12 months: ${numberFormat.format(contributions.lastYear)} contributions`}
              >
                <div
                  className="grid min-w-[590px] max-w-[56rem] grid-flow-col grid-rows-7 gap-[3px]"
                  style={{ gridAutoColumns: "minmax(0, 1fr)" }}
                >
                  {cells.map((count, index) => (
                    <span
                      key={index}
                      aria-hidden="true"
                      className={cn(
                        "aspect-square rounded-[3px]",
                        count === null ? "bg-transparent" : contributionLevels[levelOf(count)],
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="mr-1">Less</span>
                {contributionLevels.map((level) => (
                  <span key={level} aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-[3px]", level)} />
                ))}
                <span className="ml-1">More</span>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              The calendar is being refreshed. Summary statistics are available above.
            </p>
          )}
        </div>

        <div className="border-t border-border/70 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h3 className="font-medium text-foreground">Languages</h3>
          <p className="mt-1 text-xs text-muted-foreground">Across public repositories</p>
          {languages?.length ? (
            <>
              <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                {languages.map((language) => (
                  <span
                    key={language.name}
                    style={{
                      width: `${language.percent}%`,
                      backgroundColor: language.color ?? "#64748b",
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {languages.map((language) => (
                  <li key={language.name} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: language.color ?? "#64748b" }}
                      aria-hidden="true"
                    />
                    <span className="text-foreground">{language.name}</span>
                    <span>{language.percent}%</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Language data will appear with the next complete snapshot.
            </p>
          )}
        </div>
      </div>
    </HomeSection>
  );
};
