import assert from "node:assert/strict";
import console from "node:console";
import fs from "node:fs";
import process from "node:process";
import { createRequire } from "node:module";
import { URL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_PATH || "playwright");
const targets = (process.env.PORTFOLIO_PROFILE_URLS || "http://localhost:5175").split(",");
for (const target of targets) {
  const url = new URL(target);
  if (!["localhost", "127.0.0.1", "jorgedelacruzpadilla.dev"].includes(url.hostname))
    throw new Error("Unexpected verification origin.");
}
const presentation = JSON.parse(fs.readFileSync(new URL("../../content/projects.presentation.json", import.meta.url)));
const editorial = JSON.parse(fs.readFileSync(new URL("../../content/projects.editorial.json", import.meta.url)));
const expected = presentation.projects
  .filter((p) => p.featured)
  .map((p) => editorial.projects.find((e) => e.projectId === p.projectId).content.name);
const browser = await chromium.launch({ headless: true });
try {
  for (const target of targets)
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      page.setDefaultTimeout(15_000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        await page.goto(target, { waitUntil: "networkidle" });
        for (let i = 0; i < 4; i += 1) {
          await page.locator("footer").scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
        }
        const selected = page
          .locator("section")
          .filter({ has: page.getByRole("heading", { name: "Featured applications & systems" }) });
        assert.deepEqual(await selected.locator("h3").allTextContents(), expected);
        await page.goto(target + "/projects", { waitUntil: "networkidle" });
        await page.getByRole("heading", { name: "IdeaDesk", exact: true }).waitFor();
        assert.deepEqual((await page.locator("article h2, article h3").allTextContents()).slice(0, 3), expected);
        await page.getByRole("textbox").fill("UnaLuka");
        await page.waitForTimeout(300); // Wait for finite filter exit animations.
        const paused = page
          .locator("article")
          .filter({ has: page.getByRole("heading", { name: "UnaLuka", exact: true }) });
        assert.equal(await paused.getByRole("link", { name: "Live demo" }).count(), 0);
        assert.ok((await paused.innerText()).includes("Paused"));
        await page.getByRole("textbox").fill("IdeaDesk");
        await page.waitForTimeout(300);
        assert.deepEqual(await page.locator("article h2, article h3").allTextContents(), ["IdeaDesk"]);
        await page.goto(target + "/experiences", { waitUntil: "networkidle" });
        await page.getByRole("heading", { name: "Senior Software Engineer", exact: true }).first().waitFor();
        const logos = page.locator('main img[alt$=" logo"]');
        assert.equal(await logos.count(), 10);
        for (let index = 0; index < 10; index += 1) {
          const logo = logos.nth(index);
          await logo.scrollIntoViewIfNeeded();
          await logo.evaluate((image) =>
            image.complete ? null : new Promise((resolve) => image.addEventListener("load", resolve, { once: true })),
          );
          assert.ok(await logo.evaluate((image) => image.complete && image.naturalWidth > 0));
          assert.equal(await logo.evaluate((image) => globalThis.getComputedStyle(image).objectFit), "contain");
        }
        await page.addStyleTag({ content: "html { font-size: 200%; }" });
        assert.equal(
          await page.evaluate(() => globalThis.document.documentElement.scrollWidth > globalThis.innerWidth),
          false,
        );
        assert.deepEqual(errors, []);
        console.log(
          `PASS ${target} ${width}px: featured order, search, paused demo, 10 logos, 200% text, no page errors.`,
        );
      } finally {
        await context.close();
      }
    }
  // A broken CMS logo must recover to the verified local brand asset.
  const page = await browser.newPage();
  const target = targets[0];
  await page.route(
    (url) => url.pathname === "/client/experiences",
    async (route) => {
      if (route.request().method() !== "GET") return route.continue();
      const response = await route.fetch();
      const body = await response.json();
      body[0].companyLogo = target + "/__missing-company-logo.svg";
      await route.fulfill({ response, json: body });
    },
  );
  await page.route(
    (url) => url.pathname === "/__missing-company-logo.svg",
    (route) => route.fulfill({ status: 404, body: "" }),
  );
  await page.goto(target + "/experiences", { waitUntil: "networkidle" });
  const logo = page.getByRole("img", { name: "Coforge logo", exact: true });
  await logo.waitFor();
  await page.waitForFunction(() =>
    globalThis.document.querySelector('img[alt="Coforge logo"]')?.getAttribute("src")?.startsWith("/images/companies/"),
  );
  console.log("PASS: broken explicit CMS logo recovers to the verified local logo.");
  await page.close();
} finally {
  await browser.close();
}
