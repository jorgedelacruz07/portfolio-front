import assert from "node:assert/strict";
import { test } from "node:test";
import { safeHref } from "../lib/safe-href.ts";

test("safeHref allows http and https and rejects scriptable or protocol-relative URLs", () => {
  assert.equal(
    safeHref("https://example.com/path"),
    "https://example.com/path",
  );
  assert.equal(safeHref("  http://example.com  "), "http://example.com");
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref("JAVASCRIPT:alert(1)"), null);
  assert.equal(safeHref("data:text/html,hi"), null);
  assert.equal(safeHref("//evil.example"), null);
  assert.equal(safeHref("/\\evil.example"), null);
  assert.equal(safeHref("mailto:person@example.com"), null);
  assert.equal(safeHref("/documents/cv.pdf"), null);
});

test("safeHref allows mailto and same-origin paths only when asked", () => {
  assert.equal(
    safeHref("mailto:person@example.com", { mailto: true }),
    "mailto:person@example.com",
  );
  assert.equal(safeHref("javascript:alert(1)", { mailto: true }), null);
  assert.equal(
    safeHref("/documents/cv.pdf", { sameOriginPath: true }),
    "/documents/cv.pdf",
  );
  assert.equal(safeHref("//evil.example", { sameOriginPath: true }), null);
  assert.equal(
    safeHref("https://cdn.example/cv.pdf", { sameOriginPath: true }),
    "https://cdn.example/cv.pdf",
  );
});
