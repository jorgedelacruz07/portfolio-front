import assert from "node:assert/strict";
import { test } from "node:test";
import { PRODUCTION_API_URL, resolveApiBaseUrl } from "../lib/api-url.ts";

test("resolveApiBaseUrl returns envUrl when window is undefined (SSR/test)", () => {
  assert.equal(resolveApiBaseUrl("http://localhost:3003"), "http://localhost:3003");
  assert.equal(resolveApiBaseUrl(PRODUCTION_API_URL), PRODUCTION_API_URL);
  assert.equal(resolveApiBaseUrl(""), "");
});

test("resolveApiBaseUrl in local browser returns local url", () => {
  globalThis.window = { location: { hostname: "localhost" } };
  try {
    assert.equal(resolveApiBaseUrl("http://localhost:3003"), "http://localhost:3003");
  } finally {
    delete globalThis.window;
  }
});

test("resolveApiBaseUrl in production browser falls back to PRODUCTION_API_URL if localhost or empty", () => {
  globalThis.window = { location: { hostname: "jorgedelacruzpadilla.dev" } };
  try {
    assert.equal(resolveApiBaseUrl("http://localhost:3003"), PRODUCTION_API_URL);
    assert.equal(resolveApiBaseUrl("http://127.0.0.1:3003"), PRODUCTION_API_URL);
    assert.equal(resolveApiBaseUrl(""), PRODUCTION_API_URL);
    assert.equal(resolveApiBaseUrl(undefined), PRODUCTION_API_URL);
    assert.equal(resolveApiBaseUrl(PRODUCTION_API_URL), PRODUCTION_API_URL);
  } finally {
    delete globalThis.window;
  }
});
