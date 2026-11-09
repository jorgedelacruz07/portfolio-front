import assert from "node:assert/strict";
import { test } from "node:test";
import { mailtoHref, plainEmailAddress, safeHref } from "../lib/safe-href.ts";

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

test("plain email addresses reject mailbox header injection", () => {
  assert.equal(plainEmailAddress("person@example.com"), "person@example.com");
  assert.equal(
    plainEmailAddress("person+tag@example.com"),
    "person+tag@example.com",
  );
  assert.equal(mailtoHref("person@example.com"), "mailto:person@example.com");
  assert.equal(
    plainEmailAddress("person@example.com?bcc=other@evil.example"),
    null,
  );
  assert.equal(
    plainEmailAddress("person@example.com%0ABcc:other@evil.example"),
    null,
  );
  assert.equal(
    plainEmailAddress("person@example.com\nBcc:other@evil.example"),
    null,
  );
  assert.equal(
    plainEmailAddress("person@example.com\r\nBcc:other@evil.example"),
    null,
  );
  assert.equal(plainEmailAddress("person @example.com"), null);
  assert.equal(plainEmailAddress(" person@example.com"), null);
  assert.equal(mailtoHref("person@example.com?bcc=other@evil.example"), null);
  assert.equal(
    safeHref("mailto:person@example.com?bcc=other@evil.example", {
      mailto: true,
    }),
    null,
  );
});

test("plain email addresses reject an ampersand in the local-part", () => {
  assert.equal(plainEmailAddress("a&b@example.com"), null);
  assert.equal(mailtoHref("a&b@example.com"), null);
  assert.equal(
    plainEmailAddress("a.b_c+d-e@example.com"),
    "a.b_c+d-e@example.com",
  );
});

test("safeHref mailto handles malformed percent-encoding without throwing", () => {
  assert.equal(safeHref("mailto:%ZZ@example.com", { mailto: true }), null);
  assert.equal(
    safeHref("mailto:person%40example.com", { mailto: true }),
    "mailto:person@example.com",
  );
});
