import assert from "node:assert/strict";
import { test } from "node:test";
import { listView } from "../lib/list-state.ts";

test("an empty catalog is distinct from a filter with no matches", () => {
  assert.equal(listView(0, 0), "empty");
  assert.equal(listView(4, 0), "no-results");
  assert.equal(listView(4, 2), "ready");
});
