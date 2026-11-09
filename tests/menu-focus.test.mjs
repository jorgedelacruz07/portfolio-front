import assert from "node:assert/strict";
import { test } from "node:test";
import { trappedMenuIndex } from "../lib/menu-focus.ts";

test("menu focus wraps forward and backward", () => {
  assert.equal(trappedMenuIndex(3, 2, false), 0);
  assert.equal(trappedMenuIndex(3, 0, true), 2);
  assert.equal(trappedMenuIndex(3, 1, false), 2);
  assert.equal(trappedMenuIndex(0, 0, false), -1);
});
