export type TGithubLanguage = {
  name: string;
  color: string | null;
  percent: number;
};

export type TGithubCalendarWeek = {
  /** First day of the week in the payload (a Sunday, except possibly the first week). */
  date: string;
  counts: number[];
};

export type TGithubStats = {
  login: string;
  url: string;
  createdAt: string;
  followers: number;
  following: number;
  repositories: { total: number; public: number; activeLast30Days: number | null };
  contributions: {
    lastYear: number;
    commits: number;
    pullRequests: number;
    reviews: number;
    issues: number;
    private: number;
  } | null;
  streaks: { current: number; longest: number } | null;
  calendar: TGithubCalendarWeek[] | null;
  languages: TGithubLanguage[] | null;
  projects: { key: string; lastPushedAt: string }[];
  source: "graphql" | "rest";
  updatedAt: string;
};
