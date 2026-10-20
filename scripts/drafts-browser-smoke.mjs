import assert from "node:assert/strict";
import process from "node:process";
import console from "node:console";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.PORTFOLIO_SMOKE_URL || "http://127.0.0.1:5197";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  throw new Error("Use an isolated loopback preview.");
const output = path.resolve(".cache/drafts-browser");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { width: 1365, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const calls = [];
    let project;
    const content = {
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
    await page.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === new URL(origin).origin) return route.continue();
      if (url.hostname !== "api.example.com") return route.abort();
      if (request.method() === "OPTIONS")
        return route.fulfill({
          status: 204,
          headers: {
            "access-control-allow-origin": new URL(origin).origin,
            "access-control-allow-credentials": "true",
            "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
            "access-control-allow-headers": "content-type,x-csrf-token",
          },
        });
      let body;
      if (url.pathname === "/admin/auth/session")
        body = { email: "fixture@example.com", csrfToken: "synthetic", expiresAt: "2099-01-01T00:00:00Z" };
      else if (url.pathname === "/client/portfolio") body = content;
      else if (url.pathname === "/admin/projects/import-draft") {
        const data = request.postDataJSON();
        calls.push({ action: "import", data });
        project = {
          ...data.project,
          id: "fixture-id",
          status: false,
          technologies: [],
          url: "",
          from: null,
          to: null,
          createdAt: "",
          updatedAt: "",
        };
        body = project;
      } else if (url.pathname === "/admin/projects/fixture-id" && request.method() === "PUT") {
        const data = request.postDataJSON();
        calls.push({ action: "save", data });
        project = { ...project, ...data };
        body = project;
      } else if (url.pathname === "/admin/projects" || url.pathname === "/admin/experiences") body = [];
      else if (url.pathname === "/client/projects") body = project?.status ? [project] : [];
      else throw new Error(`Unexpected fixture request: ${url.pathname}`);
      await route.fulfill({
        json: body,
        headers: { "access-control-allow-origin": new URL(origin).origin, "access-control-allow-credentials": "true" },
      });
    });
    await page.goto(`${origin}/admin`);
    const file = page.getByLabel("Draft JSON");
    await file.setInputFiles({
      name: "sources.private.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify({ format: "portfolio-private-source-report", records: [] })),
    });
    await page.getByText("Choose a project draft JSON, not the private source report.").waitFor();
    const draft = {
      format: "portfolio-project-draft",
      version: 1,
      project: {
        slug: "example",
        name: "Example project",
        description: "Public summary",
        longDescription: "Problem\nA real problem.\n\nSolution\nA useful approach.",
        technologyNames: [],
        links: {},
      },
    };
    await file.setInputFiles({
      name: "example.draft.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(draft)),
    });
    const review = page.getByLabel(
      "I reviewed the text and links for public use, including personal information and claims.",
    );
    const importButton = page.getByRole("button", { name: "Import as hidden draft" });
    await review.check();
    await page.getByLabel("Public summary").fill("Revised public summary");
    assert.equal(await review.isChecked(), false);
    assert.equal(await importButton.isDisabled(), true);
    assert.equal(calls.length, 0);
    await review.check();
    await importButton.click();
    await page.getByText("Draft imported. Review the project below before making it visible.").waitFor();
    const visible = page.getByLabel("Visible on the public website after saving");
    assert.equal(await visible.isChecked(), false);
    assert.deepEqual(
      calls.map((call) => call.action),
      ["import"],
    );
    assert.equal("status" in calls[0].data.project, false);
    assert.equal("sources" in calls[0].data, false);
    await page.getByRole("button", { name: "Save project", exact: true }).click();
    await page.getByText("Project saved.", { exact: true }).waitFor();
    assert.equal(calls.at(-1).data.status, false);
    const section = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Projects", exact: true }) });
    await section.screenshot({ path: path.join(output, `admin-${viewport.width}.png`) });
    assert.equal(
      await page.evaluate(() => globalThis.document.documentElement.scrollWidth > globalThis.innerWidth),
      false,
    );
    await visible.check();
    await page.getByRole("button", { name: "Save project", exact: true }).click();
    await page.getByText("Project saved.", { exact: true }).waitFor();
    assert.equal(calls.at(-1).data.status, true);
    await page.goto(`${origin}/projects`);
    const summary = page.getByText("Read case study", { exact: true });
    await summary.click();
    await page.getByText("A useful approach.", { exact: false }).waitFor();
    await page.screenshot({ path: path.join(output, `projects-${viewport.width}.png`), fullPage: true });
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${viewport.width}px: review reset, hidden import, separate publication, public case study, no overflow or page errors (mock API).`,
    );
  }
} finally {
  await browser.close();
}
