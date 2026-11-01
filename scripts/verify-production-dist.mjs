import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
export const CANONICAL_PROD_API = "https://portfolio-api-6voehdisua-uc.a.run.app";

export function verifyProductionDist(distDir = DIST) {
  const indexHtml = path.join(distDir, "index.html");
  if (!fs.existsSync(indexHtml)) {
    throw new Error(`Production dist verification failed: index.html not found in ${distDir}`);
  }

  const assetsDir = path.join(distDir, "assets");
  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Production dist verification failed: assets directory not found in ${distDir}`);
  }

  const jsFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith(".js"));
  if (jsFiles.length === 0) {
    throw new Error(`Production dist verification failed: no JS bundles found in ${assetsDir}`);
  }

  let foundProdApi = false;
  const localhostViolations = [];

  for (const file of jsFiles) {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    if (content.includes(CANONICAL_PROD_API)) {
      foundProdApi = true;
    }

    // Match any local API URLs (e.g. localhost:3003, 127.0.0.1:3003, or localhost/client)
    const matches = content.match(
      /(?:https?:\/\/(?:localhost|127\.0\.0\.1):\d+|https?:\/\/(?:localhost|127\.0\.0\.1)\/(?:client|api|admin))/gi,
    );
    if (matches) {
      localhostViolations.push({ file, matches });
    }
  }

  if (localhostViolations.length > 0) {
    const details = localhostViolations.map((v) => `${v.file}: ${v.matches.join(", ")}`).join("\n");
    throw new Error(
      `Production dist verification failed: Localhost URL(s) detected in production bundle:\n${details}\nDeploy aborted. Ensure you built with 'npm run build:prod' using Doppler prd configuration.`,
    );
  }

  if (!foundProdApi) {
    throw new Error(
      `Production dist verification failed: Canonical production API URL (${CANONICAL_PROD_API}) was NOT found in any JS bundle in ${assetsDir}.\nDeploy aborted.`,
    );
  }

  return true;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    verifyProductionDist();
    console.log(`[PASS] Production dist verified: Contains ${CANONICAL_PROD_API} and zero localhost leaks.`);
  } catch (error) {
    console.error(`[FAIL] ${error.message}`);
    process.exit(1);
  }
}
