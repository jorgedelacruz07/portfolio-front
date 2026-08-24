import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const publicImagesDir = path.join(rootDir, "public", "images");
const jorgeImagePath = path.join(publicImagesDir, "jorge.jpg");
const tempHtmlPath = path.join(
  rootDir,
  "node_modules",
  ".cache",
  "og-card.html",
);

fs.mkdirSync(path.dirname(tempHtmlPath), { recursive: true });

const jorgeImageBase64 = `data:image/jpeg;base64,${fs.readFileSync(jorgeImagePath).toString("base64")}`;

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
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #09090b;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f4f4f5;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Background Grid Pattern */
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 70%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 70%, transparent 100%);
    }

    /* Ambient Spotlight Glows */
    .glow-cyan {
      position: absolute;
      top: -120px;
      left: -100px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0) 70%);
      pointer-events: none;
    }
    .glow-emerald {
      position: absolute;
      bottom: -150px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%);
      pointer-events: none;
    }

    /* Presentation Card Container */
    .card-container {
      position: relative;
      z-index: 10;
      width: 1120px;
      height: 550px;
      background: rgba(18, 18, 23, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 48px 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
    }

    .left-content {
      flex: 1;
      max-width: 640px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .top-meta {
      display: flex;
      align-items: center;
      gap: 12px;
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
      margin-top: 18px;
    }

    .name {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
      line-height: 1.1;
    }

    .role-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 8px;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.01em;
    }

    .bio-text {
      margin-top: 14px;
      font-size: 16px;
      line-height: 1.55;
      color: #a1a1aa;
      font-weight: 400;
    }

    .skills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
    }

    .skill-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      color: #d4d4d8;
    }

    .footer-bar {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 20px;
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

    /* Right Photo Craft Card */
    .right-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .photo-card {
      position: relative;
      width: 310px;
      height: 390px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      padding: 10px;
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
      object-position: center 20%;
      filter: grayscale(20%) contrast(1.05);
    }

    .photo-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      padding: 8px 12px;
      background: rgba(9, 9, 11, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .photo-badge-name {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
    }

    .photo-badge-role {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      color: #38bdf8;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="grid-pattern"></div>
  <div class="glow-cyan"></div>
  <div class="glow-emerald"></div>

  <div class="card-container">
    <div class="left-content">
      <div>
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
          <p class="bio-text">
            Crafting fast, resilient full-stack web applications, React architectures & cloud-native systems.
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
            <span class="photo-badge-role">Staff / Senior</span>
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

const chromePaths = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "google-chrome",
  "chromium",
];

const chromePath = chromePaths.find((p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
});

if (!chromePath) {
  console.error("Could not find Google Chrome binary to render OG image.");
  process.exit(1);
}

console.log("Rendering Open Graph Presentation Card image with Chrome...");

execSync(
  `"${chromePath}" --headless --disable-gpu --window-size=1200,630 --screenshot="${outPngPath}" "file://${tempHtmlPath}"`,
  { stdio: "inherit" },
);

try {
  execSync(`sips -s format jpeg "${outPngPath}" --out "${outJpgPath}"`, {
    stdio: "inherit",
  });
} catch {
  // sips might only exist on macOS
}

console.log("Successfully generated:");
console.log(`- ${outPngPath}`);
console.log(`- ${outJpgPath}`);
