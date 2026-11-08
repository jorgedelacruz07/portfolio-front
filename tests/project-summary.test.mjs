import assert from "node:assert/strict";
import { test } from "node:test";
import { projectCardDescription } from "../lib/project-summary.ts";

test("omits a description that only repeats the project title", () => {
  assert.equal(
    projectCardDescription({
      name: "ATGE",
      description: "ATGE",
      longDescription: null,
    }),
    null,
  );
  assert.equal(
    projectCardDescription({ name: "Legal Docs", description: " legal docs " }),
    null,
  );
});

test("keeps a distinct description and prefers it over a repeated title", () => {
  assert.equal(
    projectCardDescription({
      name: "FinTracking",
      description: "Personal finance platform.",
      longDescription: "A longer case study.",
    }),
    "Personal finance platform.",
  );
  assert.equal(
    projectCardDescription({
      name: "ATGE",
      description: "ATGE",
      longDescription: "Freelance billing workflow for a short engagement.",
    }),
    "Freelance billing workflow for a short engagement.",
  );
});
