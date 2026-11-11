import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import console from "node:console";
import { setTimeout, clearTimeout } from "node:timers";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const origin = "https://jorgedelacruzpadilla.dev";
const source = path.join(dist, "index.html");

const pages = [
  {
    route: "/",
    title: "Jorge de la Cruz Padilla | Senior Software Engineer",
    description:
      "Senior Software Engineer specializing in React.js, TypeScript, Node.js, and Native MongoDB Architecture. Building fast, scalable full-stack products.",
  },
  {
    route: "/projects",
    title: "Projects & Engineering Work | Jorge de la Cruz Padilla",
    description:
      "Selected products, personal tools, and client work built with TypeScript, React, Node.js, and other stacks.",
  },
  {
    route: "/experiences",
    title: "Professional Experience & Career History | Jorge de la Cruz Padilla",
    description: "Professional experience and career history of Jorge de la Cruz Padilla, Senior Software Engineer.",
  },
  {
    route: "/articles",
    title: "Articles & Engineering Notes | Jorge de la Cruz Padilla",
    description:
      "Engineering articles on software architecture, systems engineering, distributed systems, and software craft.",
  },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function setMeta(html, selector, tag) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`<meta\\s+${escaped}[^>]*>`, "i");
  return regex.test(html) ? html.replace(regex, tag) : html.replace("</head>", `  ${tag}\n  </head>`);
}

function setCanonical(html, url) {
  const tag = `<link rel="canonical" href="${url}" />`;
  const regex = /<link\s+rel="canonical"[^>]*>/i;
  return regex.test(html) ? html.replace(regex, tag) : html.replace("</head>", `  ${tag}\n  </head>`);
}

if (!fs.existsSync(source)) throw new Error(`Vite output missing: ${source}`);
const base = fs.readFileSync(source, "utf8");
const generatedPages = [...pages];

async function fetchPublishedArticles() {
  const apiBase = process.env.VITE_API_URL?.trim();
  if (!apiBase) {
    if (process.env.VITE_VERIFY_PROD_URL === "true") {
      throw new Error("VITE_API_URL is required to pre-render published article SEO pages.");
    }
    return [];
  }

  const controller = new globalThis.AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await globalThis.fetch(`${apiBase.replace(/\/+$/, "")}/client/articles?limit=1000`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Published articles endpoint returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.articles)) throw new Error("Published articles endpoint returned an invalid payload.");
    return payload.articles;
  } finally {
    clearTimeout(timeout);
  }
}

for (const page of pages) {
  const canonical = `${origin}${page.route}`;
  let html = base.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = setMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(page.description)}" />`);
  html = setMeta(html, 'property="og:title"', `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = setMeta(
    html,
    'property="og:description"',
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  );
  html = setMeta(html, 'property="og:url"', `<meta property="og:url" content="${canonical}" />`);
  html = setMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = setMeta(
    html,
    'name="twitter:description"',
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
  );
  html = setCanonical(html, canonical);
  const output = page.route === "/" ? source : path.join(dist, page.route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}

const articles = await fetchPublishedArticles();
for (const article of articles) {
  if (typeof article.slug !== "string" || typeof article.publicContent?.title !== "string") continue;
  const route = `/articles/${encodeURIComponent(article.slug)}`;
  const canonical = `${origin}${route}`;
  const seoTitle = article.publicContent.seo?.metaTitle?.trim() || article.publicContent.title;
  const title = `${seoTitle} | Jorge de la Cruz Padilla`;
  const description = article.publicContent.seo?.metaDescription?.trim() || article.publicContent.excerpt;
  let html = base.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(description)}" />`);
  html = setMeta(html, 'property="og:title"', `<meta property="og:title" content="${escapeHtml(seoTitle)}" />`);
  html = setMeta(
    html,
    'property="og:description"',
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = setMeta(html, 'property="og:type"', '<meta property="og:type" content="article" />');
  html = setMeta(html, 'property="og:url"', `<meta property="og:url" content="${canonical}" />`);
  html = setMeta(html, 'name="twitter:title"', `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`);
  html = setMeta(
    html,
    'name="twitter:description"',
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );
  html = setCanonical(html, canonical);
  const structuredArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.publicContent.title,
    description,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: "Jorge de la Cruz Padilla", url: origin },
    mainEntityOfPage: canonical,
  };
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${JSON.stringify(structuredArticle)}</script>\n  </head>`,
  );
  const output = path.join(dist, "articles", article.slug, "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  generatedPages.push({ route, lastmod: article.publishedAt });
}

const sitemapEntries = generatedPages
  .map(
    ({ route, lastmod }) =>
      `  <url><loc>${origin}${route}</loc>${lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}</url>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
);

console.log(
  `Generated SEO HTML for ${generatedPages.length} public routes, including ${articles.length} published articles.`,
);
