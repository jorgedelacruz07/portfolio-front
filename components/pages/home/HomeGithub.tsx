import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { HomeSection } from "@/components/pages/home/HomeSection";
import { useGithubStats } from "@/hooks";
import { cn, homeMotion } from "@/lib/utils";
import type { TGithubCalendarWeek } from "@/types/github";

const numberFormat = new Intl.NumberFormat("en");
const levelClasses = ["bg-muted", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];

/** Column-major cells (7 rows per week); weeks that do not start on Sunday are padded with empty cells. */
function buildCells(weeks: TGithubCalendarWeek[]): Array<number | null> {
  return weeks.flatMap((week) => {
    const offset = new Date(`${week.date}T00:00:00Z`).getUTCDay();
    const cells: Array<number | null> = [...Array<null>(offset).fill(null), ...week.counts];
    while (cells.length < 7) {
      cells.push(null);
    }
    return cells;
  });
}

/** Maps a daily count to one of five levels using quartiles of the active days, so it adapts to any volume. */
function buildLevelFn(cells: Array<number | null>) {
  const active = cells.filter((count): count is number => count !== null && count > 0).sort((a, b) => a - b);
  const at = (ratio: number) => active[Math.min(active.length - 1, Math.floor(active.length * ratio))] ?? 1;
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)];

  return (count: number) => {
    if (count <= 0) return 0;
    if (count <= q1) return 1;
    if (count <= q2) return 2;
    if (count <= q3) return 3;
    return 4;
  };
}

const Stat = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <motion.div variants={homeMotion.item} className="craft-card rounded-2xl p-4 sm:p-5">
    <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">{value}</p>
    {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
  </motion.div>
);

/** GitHub account statistics. Renders nothing until the API can provide contribution data. */
export const HomeGithub = () => {
  const { data } = useGithubStats();

  const cells = useMemo(() => (data?.calendar ? buildCells(data.calendar) : []), [data?.calendar]);
  const levelOf = useMemo(() => buildLevelFn(cells), [cells]);

  if (!data?.contributions || !data.calendar) {
    return null;
  }

  const { contributions, streaks, repositories, languages } = data;
  const updated = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(data.updatedAt),
  );

  return (
    <HomeSection
      id="github-activity"
      eyebrow="GitHub"
      title="Activity & statistics"
      description="Live numbers from my GitHub account. Private repositories are counted in aggregate only; their names are never shown."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat
            label="Contributions"
            value={numberFormat.format(contributions.lastYear)}
            note={`Last 12 months · ${numberFormat.format(contributions.private)} in private repos`}
          />
          <Stat
            label="Current streak"
            value={streaks ? `${streaks.current} days` : "–"}
            note={streaks ? `Longest: ${streaks.longest} days` : undefined}
          />
          <Stat
            label="Repositories"
            value={numberFormat.format(repositories.total)}
            note={
              repositories.activeLast30Days !== null ? `${repositories.activeLast30Days} active in 30 days` : undefined
            }
          />
          <Stat label="Followers" value={numberFormat.format(data.followers)} note={`${data.following} following`} />
        </div>

        <motion.div variants={homeMotion.item} className="craft-card overflow-x-auto rounded-2xl p-4 sm:p-5">
          <div
            role="img"
            aria-label={`Contribution calendar for the last 12 months: ${numberFormat.format(contributions.lastYear)} contributions`}
            className="grid min-w-[640px] max-w-[56rem] grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridAutoColumns: "minmax(0, 1fr)" }}
          >
            {cells.map((count, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={cn("aspect-square rounded-[2px]", count === null ? "" : levelClasses[levelOf(count)])}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.6875rem] text-muted-foreground">
            <span>Less</span>
            {levelClasses.map((level) => (
              <span key={level} aria-hidden="true" className={cn("h-[10px] w-[10px] rounded-[2px]", level)} />
            ))}
            <span>More</span>
          </div>
        </motion.div>

        {languages && languages.length > 0 ? (
          <motion.div variants={homeMotion.item} className="craft-card space-y-3 rounded-2xl p-4 sm:p-5">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
              Languages across all repositories
            </p>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
              {languages.map((language) => (
                <span
                  key={language.name}
                  style={{ width: `${language.percent}%`, backgroundColor: language.color ?? "currentColor" }}
                />
              ))}
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {languages.map((language) => (
                <li key={language.name} className="craft-pill text-[0.6875rem]">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: language.color ?? "currentColor" }}
                  />
                  {language.name} {language.percent}%
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        <motion.p
          variants={homeMotion.item}
          className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground"
        >
          <span>Updated {updated}</span>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            View profile on GitHub
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </motion.p>
      </div>
    </HomeSection>
  );
};
