import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { adminApi, adminApiClient, setAdminCsrfToken } from "../lib/admin-api.ts";

describe("article editor API client contracts and review lifecycle", () => {
  const originalBaseURL = adminApiClient.defaults.baseURL;
  const originalAdapter = adminApiClient.defaults.adapter;

  beforeEach(() => {
    setAdminCsrfToken("test-csrf-token-abc");
    adminApiClient.defaults.baseURL = "https://api.example.com";
  });

  afterEach(() => {
    adminApiClient.defaults.baseURL = originalBaseURL;
    adminApiClient.defaults.adapter = originalAdapter;
    setAdminCsrfToken("");
  });

  it("listArticles retrieves summarized articles with channels and latest revision", async () => {
    let calledUrl = null;
    let calledHeaders = null;

    adminApiClient.defaults.adapter = async (config) => {
      calledUrl = config.url;
      calledHeaders = config.headers;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          items: [
            {
              id: "art-1",
              slug: "distributed-lock-redis",
              contentType: "engineering-note",
              latestRevisionNumber: 3,
              title: "Distributed Locking with Redis",
              excerpt: "A deep dive into distributed locks.",
              targetChannels: ["portfolio", "linkedin"],
              createdAt: "2026-11-06T12:00:00.000Z",
              updatedAt: "2026-11-07T00:00:00.000Z",
            },
          ],
          nextCursor: null,
        },
      };
    };

    const result = await adminApi.listArticles();
    assert.equal(calledUrl, "/admin/articles");
    assert.equal(calledHeaders["Content-Type"], "application/json");
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].slug, "distributed-lock-redis");
    assert.equal(result.items[0].latestRevisionNumber, 3);
    assert.deepEqual(result.items[0].targetChannels, ["portfolio", "linkedin"]);
  });

  it("getArticle retrieves full article details with current draft revision", async () => {
    let calledUrl = null;

    adminApiClient.defaults.adapter = async (config) => {
      calledUrl = config.url;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          id: "art-1",
          slug: "distributed-lock-redis",
          contentType: "engineering-note",
          latestRevisionNumber: 2,
          createdAt: "2026-11-06T12:00:00.000Z",
          updatedAt: "2026-11-07T00:00:00.000Z",
          currentDraftRevision: {
            id: "rev-2",
            articleId: "art-1",
            revisionNumber: 2,
            schemaVersion: 2,
            contentPolicyVersion: 2,
            contentSha256: "abc123sha256",
            createdAt: "2026-11-07T00:00:00.000Z",
            publicContent: {
              contentType: "engineering-note",
              slug: "distributed-lock-redis",
              title: "Distributed Locking with Redis",
              subtitle: "Redlock algorithm caveats",
              excerpt: "Practical analysis of Redis locks.",
              contentMarkdown: "## Redlock\nLocks need TTLs.",
              targetChannels: ["portfolio", "x"],
              seo: {
                metaTitle: "Redis Locks",
                metaDescription: "Guide to locks",
                canonicalUrl: null,
                keywords: ["redis", "locks"],
              },
              socialVariants: {
                linkedin: null,
                x: {
                  channel: "x",
                  posts: ["Thread on Redis locks 1/2", "TTL matters 2/2"],
                },
              },
              references: [{ id: "ref-1", title: "Redis docs", url: "https://redis.io" }],
              claims: [{ id: "claim-1", kind: "fact", statement: "Redis is in-memory", referenceIds: ["ref-1"] }],
              readingTime: { wordCount: 50, minutes: 1 },
            },
          },
        },
      };
    };

    const article = await adminApi.getArticle("art-1");
    assert.equal(calledUrl, "/admin/articles/art-1");
    assert.equal(article.id, "art-1");
    assert.equal(article.currentDraftRevision.revisionNumber, 2);
    assert.equal(article.currentDraftRevision.publicContent.socialVariants.x?.posts.length, 2);
    // Verified: No private evidence is present in publicContent
    assert.equal(article.currentDraftRevision.publicContent.evidence, undefined);
  });

  it("createArticleDraft sends draft payload with Idempotency-Key and CSRF token", async () => {
    let capturedConfig = null;

    adminApiClient.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        status: 201,
        statusText: "Created",
        headers: {},
        config,
        data: {
          article: {
            id: "art-new",
            slug: "new-article-slug",
            contentType: "tutorial",
            latestRevisionNumber: 1,
            title: "New Tutorial",
          },
          revision: {
            id: "rev-1",
            revisionNumber: 1,
            title: "New Tutorial",
          },
          replayed: false,
        },
      };
    };

    const draft = {
      format: "portfolio-article-draft",
      version: 2,
      article: {
        slug: "new-article-slug",
        title: "New Tutorial",
        excerpt: "Summary text",
        contentMarkdown: "Content",
        contentType: "tutorial",
        targetChannels: ["portfolio", "linkedin"],
      },
      evidence: {
        privacyClassification: "public-source",
      },
    };

    const result = await adminApi.createArticleDraft(draft, "test-idempotency-key-001");
    assert.equal(capturedConfig.method, "post");
    assert.equal(capturedConfig.url, "/admin/articles");
    assert.equal(capturedConfig.headers["Idempotency-Key"], "test-idempotency-key-001");
    assert.equal(capturedConfig.headers["x-csrf-token"], "test-csrf-token-abc");
    assert.deepEqual(JSON.parse(capturedConfig.data), draft);
    assert.equal(result.article.id, "art-new");
    assert.equal(result.replayed, false);
  });

  it("createArticleRevision sends CAS expectedRevisionNumber and returns new revision", async () => {
    let capturedConfig = null;

    adminApiClient.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        status: 201,
        statusText: "Created",
        headers: {},
        config,
        data: {
          article: {
            id: "art-1",
            latestRevisionNumber: 3,
          },
          revision: {
            id: "rev-3",
            revisionNumber: 3,
          },
          replayed: false,
        },
      };
    };

    const result = await adminApi.createArticleRevision("art-1", 2, { title: "Updated Title" }, "cas-key-002");

    assert.equal(capturedConfig.url, "/admin/articles/art-1/revisions");
    assert.equal(capturedConfig.headers["Idempotency-Key"], "cas-key-002");
    assert.equal(capturedConfig.headers["x-csrf-token"], "test-csrf-token-abc");
    const body = JSON.parse(capturedConfig.data);
    assert.equal(body.expectedRevisionNumber, 2);
    assert.deepEqual(body.draft, { title: "Updated Title" });
    assert.equal(result.article.latestRevisionNumber, 3);
  });

  it("getArticleReview retrieves review state and blockers", async () => {
    let capturedUrl = null;

    adminApiClient.defaults.adapter = async (config) => {
      capturedUrl = config.url;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: {
          articleId: "art-1",
          revisionId: "rev-1",
          revisionNumber: 1,
          contentSha256: "sha256...",
          state: "in_review",
          blockers: ["evidence_review_required"],
          decisions: [
            {
              sequence: 1,
              command: "submit",
              fromState: "draft",
              toState: "in_review",
              actor: { email: "editor@example.com" },
              note: "Ready for review",
              createdAt: "2026-11-07T00:00:00.000Z",
            },
          ],
        },
      };
    };

    const review = await adminApi.getArticleReview("art-1", 1);
    assert.equal(capturedUrl, "/admin/articles/art-1/revisions/1/review");
    assert.equal(review.state, "in_review");
    assert.deepEqual(review.blockers, ["evidence_review_required"]);
    assert.equal(review.decisions.length, 1);
    assert.equal(review.decisions[0].command, "submit");
  });

  it("decideArticleReview sends command, optional note and CSRF token", async () => {
    let capturedConfig = null;

    adminApiClient.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        status: 201,
        statusText: "Created",
        headers: {},
        config,
        data: {
          review: {
            state: "approved",
            blockers: [],
          },
          decision: {
            command: "approve",
            fromState: "in_review",
            toState: "approved",
          },
          replayed: false,
        },
      };
    };

    const result = await adminApi.decideArticleReview(
      "art-1",
      1,
      "approve",
      "Approved after checking references",
      "review-key-003",
    );

    assert.equal(capturedConfig.method, "post");
    assert.equal(capturedConfig.url, "/admin/articles/art-1/revisions/1/review");
    assert.equal(capturedConfig.headers["Idempotency-Key"], "review-key-003");
    assert.equal(capturedConfig.headers["x-csrf-token"], "test-csrf-token-abc");
    const body = JSON.parse(capturedConfig.data);
    assert.equal(body.command, "approve");
    assert.equal(body.note, "Approved after checking references");
    assert.equal(result.review.state, "approved");
  });
});
