import assert from "node:assert/strict";
import { test } from "node:test";
import { readProjectDraft } from "../lib/project-draft.ts";

test("reads an editorial draft while rejecting malformed previews and private reports", () => {
  const draft = {
    format: "portfolio-project-draft",
    version: 1,
    project: { slug: "example", name: "Example", description: "Summary", links: {}, technologyNames: [] },
  };
  assert.equal(readProjectDraft(JSON.stringify(draft)).project.name, "Example");
  for (const value of [
    null,
    [],
    { ...draft, project: { ...draft.project, longDescription: {} } },
    { ...draft, project: { ...draft.project, links: null } },
    { format: "portfolio-private-source-report", records: [] },
  ]) {
    assert.throws(() => readProjectDraft(JSON.stringify(value)));
  }
  assert.throws(() => readProjectDraft(" ".repeat(40001)));
});
