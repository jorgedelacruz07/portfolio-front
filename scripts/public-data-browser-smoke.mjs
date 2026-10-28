import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import process from "node:process";
import console from "node:console";
import { URL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.PORTFOLIO_SMOKE_URL || "http://localhost:5175";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) {
  throw new Error("Run against a loopback Vite development server only.");
}

const fullStats = {
  login: "fixture",
  url: "https://github.com/fixture",
  createdAt: "2020-01-01T00:00:00Z",
  followers: 1,
  following: 1,
  repositories: { total: 1, public: 1, activeLast30Days: 1 },
  contributions: { lastYear: 42, commits: 42, pullRequests: 0, reviews: 0, issues: 0, private: 0 },
  streaks: { current: 1, longest: 1 },
  calendar: [{ date: "2026-10-25", counts: [0, 0, 0, 42] }],
  languages: [],
  projects: [],
  source: "graphql",
  updatedAt: "2026-10-28T17:00:00Z",
};
const incompleteStats = { ...fullStats, source: "rest", contributions: null, calendar: null };
const portfolio = {
  profile: {
    name: "Fixture",
    headline: "Engineer",
    shortBio: "Synthetic content",
    location: "",
    availability: "",
    contactEmail: "fixture@example.com",
    socialLinks: [],
  },
  settings: { seoTitle: "Fixture", seoDescription: "", contactEmail: "", availabilityText: "", footerText: "" },
  skills: [],
  projects: [],
  experiences: [],
};
const clientRoute = (url) => url.pathname.startsWith("/client/");
const methods = [
  "getPortfolio",
  "getProjects",
  "getExperiences",
  "getGithubStats",
  "getCategories",
  "getProjectBySlug",
  "getExperienceBySlug",
];
let reads = 0;
const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "content-type,cache-control");
  res.setHeader("Cache-Control", "public, max-age=600");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  reads += 1;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(reads === 1 ? incompleteStats : fullStats));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const fixtureOrigin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
try {
  // Real browser HTTP cache, without request interception (which would disable caching).
  const cachePage = await browser.newPage();
  await cachePage.goto(origin, { waitUntil: "networkidle" });
  const sources = await cachePage.evaluate(async (baseURL) => {
    const { api, apiClient } = await import("/lib/api.ts");
    apiClient.defaults.baseURL = baseURL;
    return [(await api.getGithubStats()).source, (await api.getGithubStats()).source];
  }, fixtureOrigin);
  assert.deepEqual(sources, ["rest", "graphql"]);
  assert.equal(reads, 2, "the old REST response must be revalidated even while its cache is fresh");
  await cachePage.close();
  console.log("PASS: old HTTP-cached GitHub response is revalidated.");

  const failurePage = await browser.newPage();
  await failurePage.route(clientRoute, (route) => route.abort());
  await failurePage.goto(origin, { waitUntil: "networkidle" });
  const rejected = await failurePage.evaluate(async (names) => {
    const { api } = await import("/lib/api.ts");
    return Promise.all(
      names.map(async (name) => {
        try {
          await api[name]("fixture");
          return false;
        } catch {
          return true;
        }
      }),
    );
  }, methods);
  assert.ok(rejected.every(Boolean), "network failures must not become synthetic public content");
  await failurePage.unroute(clientRoute);
  await failurePage.route(clientRoute, (route) => route.fulfill({ status: 404, json: {} }));
  const missing = await failurePage.evaluate(async () => {
    const { api } = await import("/lib/api.ts");
    let portfolioRejected = false;
    try {
      await api.getPortfolio();
    } catch {
      portfolioRejected = true;
    }
    return {
      portfolioRejected,
      project: await api.getProjectBySlug("missing"),
      experience: await api.getExperienceBySlug("missing"),
    };
  });
  assert.deepEqual(missing, { portfolioRejected: true, project: null, experience: null });
  await failurePage.close();
  console.log("PASS: network/portfolio errors stay observable; missing detail pages still return null.");

  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const errors = [];
    const loadErrors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => loadErrors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on("console", (message) => {
      if (message.type() === "error") loadErrors.push(message.text());
    });
    let ready = false;
    const calls = [];
    await page.route(clientRoute, (route) => {
      calls.push({ url: route.request().url(), ready });
      return route.fulfill({
        json: route.request().url().endsWith("/github") ? (ready ? fullStats : incompleteStats) : portfolio,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-headers": "content-type,cache-control",
        },
      });
    });
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.ok(
      await page.locator("footer").count(),
      JSON.stringify({ errors, loadErrors, body: (await page.locator("body").innerText()).slice(0, 1200) }),
    );
    await page.locator("footer").scrollIntoViewIfNeeded();
    const section = page.locator("#github-activity");
    await section.getByText("GitHub activity is temporarily unavailable.").waitFor();
    assert.ok(await section.getByRole("button", { name: "Try again" }).isVisible());
    ready = true;
    const other = await context.newPage();
    await other.goto("about:blank");
    await other.bringToFront();
    await page.bringToFront();
    // Headless Chromium does not consistently change visibility when switching pages.
    // Exercise the same DOM event consumed by TanStack Query's focus manager.
    await page.evaluate(() => {
      for (const value of ["hidden", "visible"]) {
        Object.defineProperty(globalThis.document, "visibilityState", { configurable: true, value });
        globalThis.document.dispatchEvent(new globalThis.Event("visibilitychange", { bubbles: true }));
      }
    });
    try {
      await section
        .getByRole("img", { name: "Contribution calendar for the last 12 months: 42 contributions" })
        .waitFor();
    } catch {
      const query = await page.evaluate(async () => {
        const { queryClient } = await import("/lib/query-client.ts");
        const q = queryClient.getQueryCache().find({ queryKey: ["github", "stats"] });
        return {
          state: q?.state,
          observers: q?.observers?.map((o) => ({
            focus: o.options.refetchOnWindowFocus,
            stale: typeof o.options.staleTime,
          })),
        };
      });
      throw new Error(JSON.stringify({ calls, errors, loadErrors, text: await section.innerText(), query }));
    }
    assert.equal(
      await page.evaluate(() => globalThis.document.documentElement.scrollWidth > globalThis.innerWidth),
      false,
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`PASS ${width}px: incomplete statistics stay visible and recover on tab return without reload.`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
