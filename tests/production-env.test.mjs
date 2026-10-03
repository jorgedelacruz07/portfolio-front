import assert from "node:assert/strict";
import { test } from "node:test";
import { validateProductionApiUrl } from "../config/validateProductionEnv.ts";

test("production builds reject missing API configuration", () => {
  for (const value of [undefined, "", "   "]) {
    assert.throws(() => validateProductionApiUrl(value), /required/);
  }
});

test("production builds reject invalid and relative API URLs", () => {
  for (const value of ["/api", "undefined", "ftp://example.com"]) {
    assert.throws(() => validateProductionApiUrl(value), /absolute HTTP/);
  }
});

test("production builds reject loopback API URLs", () => {
  for (const value of [
    "http://localhost:3003",
    "http://127.0.0.1:3003",
    "http://127.1.2.3",
    "http://0.0.0.0:3003",
    "http://[::1]:3003",
    "http://api.localhost:3003",
  ]) {
    assert.throws(() => validateProductionApiUrl(value), /local address/);
  }
});

test("production builds accept the configured remote API", () => {
  assert.doesNotThrow(() => validateProductionApiUrl(" https://api.example.com "));
});
