import assert from "node:assert/strict";
import { test } from "node:test";
import { readStoredTheme, resolveTheme } from "../lib/theme.ts";

test("theme defaults to the system preference", () => {
  assert.equal(readStoredTheme(null), "system");
  assert.equal(readStoredTheme("sepia"), "system");
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
});

test("an explicit choice overrides the system preference", () => {
  assert.equal(readStoredTheme("light"), "light");
  assert.equal(readStoredTheme("dark"), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});
