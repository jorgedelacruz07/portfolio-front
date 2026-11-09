import { ArrowUpRight } from "lucide-react";

import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { useGithubStats } from "@/hooks";
import { safeHref } from "@/lib/safe-href";

const numberFormat = new Intl.NumberFormat("en");

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-foreground">
      {value}
    </p>
  </div>
);

/** Compact summary. The full calendar and language breakdown stay on GitHub. */
export const HomeGithub = () => {
  const { data, isError, isFetching, refetch } = useGithubStats();

  if (isError) {
    return (
      <HomeSection
        eyebrow="GitHub"
        title="GitHub activity could not be loaded"
        description="This section could not be loaded. The rest of the page is still available."
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void refetch();
          }}
          disabled={isFetching}
        >
          {isFetching ? "Trying again..." : "Try again"}
        </Button>
      </HomeSection>
    );
  }

  if (!data?.contributions) {
    return null;
  }

  const { contributions, streaks, repositories } = data;

  return (
    <HomeSection id="github-activity" eyebrow="GitHub" title="Activity">
      <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat
            label="Contributions"
            value={numberFormat.format(contributions.lastYear)}
          />
          <Stat label="Streak" value={streaks ? `${streaks.current}d` : "–"} />
          <Stat
            label="Repositories"
            value={numberFormat.format(repositories.total)}
          />
          <Stat label="Followers" value={numberFormat.format(data.followers)} />
        </div>
        {safeHref(data.url) ? (
          <a
            href={safeHref(data.url) ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-foreground underline-offset-4 hover:underline"
          >
            View on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <span className="break-all text-sm text-muted-foreground">
            {data.url}
          </span>
        )}
      </div>
    </HomeSection>
  );
};
