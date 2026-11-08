import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const publicImagesDir = path.join(rootDir, "public", "images");
const jorgeImagePath = path.join(publicImagesDir, "jorge.jpg");
const tempHtmlPath = path.join(rootDir, "node_modules", ".cache", "og-card.html");

fs.mkdirSync(path.dirname(tempHtmlPath), { recursive: true });

const jorgeImageBase64 = `data:image/jpeg;base64,${fs.readFileSync(jorgeImagePath).toString("base64")}`;

// 1200x630 card. X paints its title caption over the bottom-left of the image,
// so the identity block sits in the upper-center safe area and the bottom
// ~100px stays empty background. The same inset keeps a LinkedIn thumbnail
// crop from clipping the name, title, or photo.
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
    }
    body {
      background-color: #09090b;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f4f4f5;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 32px 0 0;
      position: relative;
      -webkit-font-smoothing: antialiased;
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 42%, #000 60%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 42%, #000 60%, transparent 100%);
    }

    .glow-cyan {
      position: absolute;
      top: -140px;
      left: -80px;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0) 70%);
      pointer-events: none;
    }
    .glow-emerald {
      position: absolute;
      bottom: -180px;
      right: -80px;
      width: 560px;
      height: 560px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%);
      pointer-events: none;
    }

    .card-container {
      position: relative;
      z-index: 10;
      width: 960px;
      height: 496px;
      background: rgba(18, 18, 23, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 28px 36px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .left-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .top-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px 14px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #34d399;
      letter-spacing: 0.02em;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }

    .location-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #a1a1aa;
      font-weight: 500;
    }

    .main-heading {
      margin-top: 16px;
    }

    .name {
      font-size: 50px;
      font-weight: 800;
      letter-spacing: -0.035em;
      color: #ffffff;
      line-height: 1.05;
    }

    .role-title {
      font-size: 25px;
      font-weight: 700;
      margin-top: 6px;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.015em;
      line-height: 1.2;
    }

    .tagline {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
      font-size: 18px;
      font-weight: 500;
      color: #d5dee7;
      letter-spacing: 0.01em;
      line-height: 1.3;
    }

    .tagline-dot {
      color: #5eead4;
      font-weight: 700;
    }

    .bio-text {
      margin-top: 12px;
      max-width: 520px;
      font-size: 15px;
      line-height: 1.45;
      color: #a1a1aa;
      font-weight: 400;
    }

    .skills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .skill-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      color: #d4d4d8;
    }

    .footer-bar {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .domain-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
    }

    .domain-dot {
      width: 6px;
      height: 6px;
      background-color: #38bdf8;
      border-radius: 50%;
    }

    .github-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #71717a;
    }

    .right-content {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .photo-card {
      position: relative;
      width: 248px;
      height: 316px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 22px;
      padding: 8px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
    }

    .photo-inner {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      background: #18181b;
    }

    .photo-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 18%;
      filter: grayscale(20%) contrast(1.05);
    }

    .photo-badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      padding: 8px 12px;
      background: rgba(9, 9, 11, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }

    .photo-badge-name {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }

    .photo-badge-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      color: #38bdf8;
      letter-spacing: 0.04em;
      line-height: 1.3;
    }
  </style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="glow-cyan"></div>
  <div class="glow-emerald"></div>

  <div class="card-container">
    <div class="left-content">
      <div class="top-meta">
        <div class="status-pill">
          <span class="status-dot"></span>
          <span>Available for work</span>
        </div>
        <span class="location-text">Lima, Peru // Remote</span>
      </div>

      <div class="main-heading">
        <h1 class="name">Jorge de la Cruz</h1>
        <div class="role-title">Senior Software Engineer</div>
        <p class="tagline">
          <span>AI-assisted delivery</span>
          <span class="tagline-dot" aria-hidden="true">·</span>
          <span>Security</span>
          <span class="tagline-dot" aria-hidden="true">·</span>
          <span>Product thinking</span>
        </p>
        <p class="bio-text">
          Crafting fast, resilient full-stack web applications, React architectures &amp; cloud-native systems.
        </p>
      </div>

      <div class="skills-row">
        <span class="skill-badge">React.js</span>
        <span class="skill-badge">TypeScript</span>
        <span class="skill-badge">Node.js</span>
        <span class="skill-badge">MongoDB</span>
        <span class="skill-badge">Cloud APIs</span>
        <span class="skill-badge">Vite</span>
      </div>

      <div class="footer-bar">
        <div class="domain-badge">
          <span class="domain-dot"></span>
          <span>jorgedelacruzpadilla.dev</span>
        </div>
        <span class="github-link">github.com/jorgedelacruz07</span>
      </div>
    </div>

    <div class="right-content">
      <div class="photo-card">
        <div class="photo-inner">
          <img src="${jorgeImageBase64}" alt="Jorge de la Cruz">
          <div class="photo-badge">
            <span class="photo-badge-name">Jorge de la Cruz</span>
            <span class="photo-badge-role">Senior Software Engineer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(tempHtmlPath, htmlContent, "utf8");

const outPngPath = path.join(publicImagesDir, "og-image.png");
const outJpgPath = path.join(publicImagesDir, "og-image.jpg");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/local/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    try {
      const found = execSync(`command -v ${name}`, { encoding: "utf8" }).trim();
      if (found && fs.existsSync(found)) return found;
    } catch {
      // Try the next binary name.
    }
  }

  return null;
}

const chromePath = findChrome();

if (!chromePath) {
  console.error("Could not find Google Chrome binary to render OG image.");
  process.exit(1);
}

console.log("Rendering Open Graph Presentation Card image with Chrome...");

const chromeArgs = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--default-background-color=00000000",
  "--virtual-time-budget=12000",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${path.join(rootDir, "node_modules", ".cache", "og-chrome")}`,
  `--screenshot=${outPngPath}`,
];

if (process.platform !== "darwin") {
  chromeArgs.push("--no-sandbox", "--disable-dev-shm-usage");
}

chromeArgs.push(`file://${tempHtmlPath}`);

execSync(`"${chromePath}" ${chromeArgs.map((arg) => `"${arg}"`).join(" ")}`, {
  stdio: "inherit",
});

function writeJpeg() {
  try {
    execSync(`sips -s format jpeg "${outPngPath}" --out "${outJpgPath}"`, {
      stdio: "inherit",
    });
    return;
  } catch {
    // sips is macOS-only.
  }

  try {
    execSync(`ffmpeg -y -i "${outPngPath}" -frames:v 1 -qscale:v 3 -update 1 "${outJpgPath}"`, {
      stdio: "inherit",
    });
  } catch {
    console.warn("JPEG fallback was not written (sips and ffmpeg unavailable).");
  }
}

writeJpeg();

console.log("Successfully generated:");
console.log(`- ${outPngPath}`);
console.log(`- ${outJpgPath}`);
