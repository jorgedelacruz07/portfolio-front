import assert from "node:assert/strict";
import process from "node:process";
import { afterEach, beforeEach, describe, it } from "node:test";
import { api, apiClient } from "../lib/api.ts";
import { shouldRetryArticleQuery } from "../lib/query-retry.ts";
import { isSafeUrl, parseBlocks, parseInline } from "../lib/markdown.ts";

describe("public articles API client contracts", () => {
  const originalBaseURL = apiClient.defaults.baseURL;
  const originalAdapter = apiClient.defaults.adapter;
  const originalEnvUrl = process.env.VITE_API_URL;

  beforeEach(() => {
    process.env.VITE_API_URL = "https://api.example.com";
    apiClient.defaults.baseURL = "https://api.example.com";
  });

  afterEach(() => {
    apiClient.defaults.baseURL = originalBaseURL;
    apiClient.defaults.adapter = originalAdapter;
    process.env.VITE_API_URL = originalEnvUrl;
  });

  it("getArticles queries /client/articles and normalizes array payload", async () => {
    let calledUrl = null;
    let calledMethod = null;

    apiClient.defaults.adapter = async (config) => {
      calledUrl = config.url;
      calledMethod = config.method;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          articles: [
            {
              id: "art-1",
              slug: "atomic-cas-patterns",
              contentType: "engineering-note",
              title: "Atomic CAS Patterns in Node.js",
              excerpt: "Implementing compare-and-swap operations.",
              readingTimeMinutes: 4,
              publishedAt: "2026-11-07T00:00:00.000Z",
              publishedRevisionNumber: 2,
            },
          ],
        },
      };
    };

    const articles = await api.getArticles();

    assert.equal(calledUrl, "/client/articles");
    assert.equal(calledMethod?.toLowerCase(), "get");
    assert.equal(articles.length, 1);
    assert.equal(articles[0].slug, "atomic-cas-patterns");
    assert.equal(articles[0].publishedRevisionNumber, 2);
    // Strict privacy: no private evidence in public summary
    assert.equal("privateEvidence" in articles[0], false);
    assert.equal("contentSha256" in articles[0], false);
  });

  it("getArticleBySlug queries /client/articles/:slug and returns article details", async () => {
    let calledUrl = null;

    apiClient.defaults.adapter = async (config) => {
      calledUrl = config.url;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          id: "art-1",
          slug: "atomic-cas-patterns",
          contentType: "engineering-note",
          publishedAt: "2026-11-07T00:00:00.000Z",
          publishedRevisionNumber: 2,
          publicContent: {
            contentType: "engineering-note",
            slug: "atomic-cas-patterns",
            title: "Atomic CAS Patterns in Node.js",
            subtitle: "Safe concurrency in MongoDB",
            excerpt: "Implementing compare-and-swap operations.",
            contentMarkdown: "# Atomic Concurrency\n\nContent details here.",
            targetChannels: ["portfolio"],
            seo: {
              metaTitle: "Atomic CAS Patterns in Node.js",
              metaDescription: "Guide to atomic CAS concurrency.",
              canonicalUrl:
                "https://jorgedelacruz.dev/articles/atomic-cas-patterns",
              keywords: ["concurrency", "mongodb"],
            },
            socialVariants: { linkedin: null, x: null },
            references: [
              {
                id: "ref-1",
                title: "MongoDB Transactions",
                url: "https://www.mongodb.com/docs",
              },
            ],
            claims: [
              {
                id: "c-1",
                kind: "fact",
                statement: "CAS prevents lost updates",
                referenceIds: ["ref-1"],
              },
            ],
            readingTime: { wordCount: 800, minutes: 4 },
          },
        },
      };
    };

    const article = await api.getArticleBySlug("atomic-cas-patterns");

    assert.equal(calledUrl, "/client/articles/atomic-cas-patterns");
    assert.ok(article);
    assert.equal(article.slug, "atomic-cas-patterns");
    assert.equal(article.publicContent.title, "Atomic CAS Patterns in Node.js");
    assert.equal(article.publicContent.references.length, 1);
    assert.equal(article.publicContent.claims.length, 1);
    // Strict isolation: no private fields
    assert.equal("privateEvidence" in article, false);
    assert.equal("evidenceReviews" in article, false);
  });

  it("getArticles treats a missing catalog as an empty list without retrying inside the client", async () => {
    let calls = 0;
    apiClient.defaults.adapter = async (config) => {
      calls += 1;
      const error = new Error("Request failed with status code 404");
      error.response = {
        status: 404,
        statusText: "Not Found",
        headers: {},
        config,
        data: { message: "Cannot GET /client/articles" },
      };
      error.isAxiosError = true;
      throw error;
    };

    const articles = await api.getArticles();
    assert.deepEqual(articles, []);
    assert.equal(calls, 1);
  });

  it("getArticleBySlug returns null for unpublished or 404 responses (fails closed)", async () => {
    apiClient.defaults.adapter = async (config) => {
      const err = new Error("Request failed with status code 404");
      err.response = {
        status: 404,
        statusText: "Not Found",
        headers: {},
        config,
        data: { message: "Article not found" },
      };
      err.isAxiosError = true;
      throw err;
    };

    const result = await api.getArticleBySlug("unpublished-draft-slug");
    assert.equal(result, null);
  });
});

describe("article catalog retries", () => {
  it("does not retry a 404 and still retries other failures twice", () => {
    assert.equal(shouldRetryArticleQuery(0, { status: 404 }), false);
    assert.equal(shouldRetryArticleQuery(1, { status: 404 }), false);
    assert.equal(shouldRetryArticleQuery(0, { status: 500 }), true);
    assert.equal(shouldRetryArticleQuery(1, { status: 500 }), true);
    assert.equal(shouldRetryArticleQuery(2, { status: 500 }), false);
  });
});

describe("SafeMarkdown URL protocol screening and parser security", () => {
  it("isSafeUrl accepts valid https, http, relative, and anchor paths", () => {
    assert.equal(isSafeUrl("https://jorgedelacruz.dev"), true);
    assert.equal(isSafeUrl("http://example.com"), true);
    assert.equal(isSafeUrl("/articles/atomic-cas"), true);
    assert.equal(isSafeUrl("./relative-doc"), true);
    assert.equal(isSafeUrl("#heading-anchor"), true);
  });

  it("isSafeUrl rejects dangerous schemes: javascript, data, vbscript, file", () => {
    assert.equal(isSafeUrl("javascript:alert('xss')"), false);
    assert.equal(isSafeUrl("JAVASCRIPT:alert(1)"), false);
    assert.equal(
      isSafeUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="),
      false,
    );
    assert.equal(isSafeUrl("vbscript:msgbox(1)"), false);
    assert.equal(isSafeUrl("file:///etc/passwd"), false);
    assert.equal(isSafeUrl(""), false);
    assert.equal(isSafeUrl(null), false);
  });

  it("parseInline neutralizes unsafe javascript: links by stripping href", () => {
    const raw = "Click [here](javascript:alert(1)) to test.";
    const tokens = parseInline(raw);

    // No link token with javascript href is produced
    const hasUnsafeLink = tokens.some(
      (t) => t.type === "link" && t.href.includes("javascript"),
    );
    assert.equal(hasUnsafeLink, false);

    // Label text is preserved
    const textContent = JSON.stringify(tokens);
    assert.ok(textContent.includes("here"));
  });

  it("parseBlocks parses standard markdown structures without executing raw HTML", () => {
    const markdown = [
      "# Header 1",
      "",
      "A paragraph with **bold**, *italic*, and `inline code`.",
      "",
      "```typescript",
      "const x: number = 42;",
      "```",
      "",
      "> A blockquote note",
      "",
      "- Bullet item 1",
      "- Bullet item 2",
      "",
      "1. Numbered 1",
      "2. Numbered 2",
      "",
      "---",
      "",
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert(1)>",
    ].join("\n");

    const blocks = parseBlocks(markdown);

    assert.ok(blocks.some((b) => b.type === "heading" && b.level === 1));
    assert.ok(
      blocks.some((b) => b.type === "codeblock" && b.lang === "typescript"),
    );
    assert.ok(blocks.some((b) => b.type === "blockquote"));
    assert.ok(blocks.some((b) => b.type === "unordered_list"));
    assert.ok(blocks.some((b) => b.type === "ordered_list"));
    assert.ok(blocks.some((b) => b.type === "hr"));

    // Raw HTML tags are converted to text blocks, never executed
    const scriptBlock = blocks.find(
      (b) => b.type === "paragraph" && JSON.stringify(b).includes("<script>"),
    );
    assert.ok(scriptBlock);
  });
});
