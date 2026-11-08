import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const SHARE_IMAGE = "https://jorgedelacruzpadilla.dev/images/og-image.png?v=2";

function metaContent(source, key) {
  const tags = source.match(/<meta\b[\s\S]*?>/g) || [];

  for (const tag of tags) {
    const name = tag.match(/\b(?:property|name)=["']([^"']+)["']/);
    if (name?.[1] !== key) continue;

    const content = tag.match(/\bcontent=["']([^"']+)["']/);
    return content?.[1] ?? null;
  }

  return null;
}

test("homepage social tags use an absolute summary_large_image card", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

  assert.equal(metaContent(html, "og:type"), "website");
  assert.equal(metaContent(html, "og:url"), "https://jorgedelacruzpadilla.dev");
  assert.equal(metaContent(html, "og:title"), "Jorge de la Cruz | Senior Software Engineer");
  assert.equal(metaContent(html, "og:image"), SHARE_IMAGE);
  assert.equal(metaContent(html, "og:image:secure_url"), SHARE_IMAGE);
  assert.equal(metaContent(html, "og:image:type"), "image/png");
  assert.equal(metaContent(html, "og:image:width"), "1200");
  assert.equal(metaContent(html, "og:image:height"), "630");
  assert.match(metaContent(html, "og:image:alt") ?? "", /Senior Software Engineer/);
  assert.equal(metaContent(html, "twitter:card"), "summary_large_image");
  assert.equal(metaContent(html, "twitter:image"), SHARE_IMAGE);
  assert.match(metaContent(html, "twitter:image:alt") ?? "", /Senior Software Engineer/);
  assert.match(metaContent(html, "og:image") ?? "", /^https:\/\//);
  assert.match(metaContent(html, "twitter:image") ?? "", /^https:\/\//);
});

test("layout helmet repeats the absolute summary_large_image tags", () => {
  const layout = fs.readFileSync(path.join(root, "components/Layout.tsx"), "utf8");

  assert.equal(metaContent(layout, "og:image"), SHARE_IMAGE);
  assert.equal(metaContent(layout, "og:image:width"), "1200");
  assert.equal(metaContent(layout, "og:image:height"), "630");
  assert.equal(metaContent(layout, "twitter:card"), "summary_large_image");
  assert.equal(metaContent(layout, "twitter:image"), SHARE_IMAGE);
  assert.match(layout, /const currentUrl = `https:\/\/jorgedelacruzpadilla\.dev\$\{location\.pathname\}`/);
  assert.match(layout, /property="og:url" content=\{currentUrl\}/);
});

test("share card artwork is 1200x630 and no longer labels the photo as staff", () => {
  const png = fs.readFileSync(path.join(root, "public/images/og-image.png"));
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);

  const generator = fs.readFileSync(path.join(root, "scripts/generate-og-image.js"), "utf8");
  assert.match(generator, /AI-assisted delivery/);
  assert.match(generator, /Senior Software Engineer/);
  assert.doesNotMatch(generator, /staff\s*\/\s*senior/i);
});
