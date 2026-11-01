import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { CANONICAL_PROD_API, verifyProductionDist } from "../scripts/verify-production-dist.mjs";

test("verifyProductionDist rejects missing index.html or assets", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dist-test-"));
  try {
    assert.throws(() => verifyProductionDist(tmpDir), /index\.html not found/);
    fs.writeFileSync(path.join(tmpDir, "index.html"), "<html></html>");
    assert.throws(() => verifyProductionDist(tmpDir), /assets directory not found/);
    fs.mkdirSync(path.join(tmpDir, "assets"));
    assert.throws(() => verifyProductionDist(tmpDir), /no JS bundles found/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("verifyProductionDist rejects localhost leaks", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dist-test-"));
  try {
    fs.writeFileSync(path.join(tmpDir, "index.html"), "<html></html>");
    const assets = path.join(tmpDir, "assets");
    fs.mkdirSync(assets);
    fs.writeFileSync(path.join(assets, "app.js"), `const api = "http://localhost:3003"; ${CANONICAL_PROD_API}`);
    assert.throws(() => verifyProductionDist(tmpDir), /Localhost URL\(s\) detected/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("verifyProductionDist allows internal framework fallback URLs like new URL(path, http://localhost)", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dist-test-"));
  try {
    fs.writeFileSync(path.join(tmpDir, "index.html"), "<html></html>");
    const assets = path.join(tmpDir, "assets");
    fs.mkdirSync(assets);
    fs.writeFileSync(
      path.join(assets, "app.js"),
      `const fallback = "http://localhost"; const api = "${CANONICAL_PROD_API}";`,
    );
    assert.equal(verifyProductionDist(tmpDir), true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("verifyProductionDist rejects bundles without the canonical production API", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dist-test-"));
  try {
    fs.writeFileSync(path.join(tmpDir, "index.html"), "<html></html>");
    const assets = path.join(tmpDir, "assets");
    fs.mkdirSync(assets);
    fs.writeFileSync(path.join(assets, "app.js"), `const api = "https://other-domain.com";`);
    assert.throws(() => verifyProductionDist(tmpDir), /Canonical production API URL .* was NOT found/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("verifyProductionDist accepts valid production bundles", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dist-test-"));
  try {
    fs.writeFileSync(path.join(tmpDir, "index.html"), "<html></html>");
    const assets = path.join(tmpDir, "assets");
    fs.mkdirSync(assets);
    fs.writeFileSync(path.join(assets, "app.js"), `const api = "${CANONICAL_PROD_API}";`);
    assert.equal(verifyProductionDist(tmpDir), true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
