import assert from "node:assert/strict";
import { createServer } from "vite";
import { describe, it } from "node:test";
import {
  canonicalArticleUrl,
  getDestinationActions,
  finalLinkedInCopy,
  finalXCopy,
} from "../lib/article-delivery.ts";
import {
  adminApi,
  adminApiClient,
  setAdminCsrfToken,
} from "../lib/admin-api.ts";

describe("article delivery controls and API contract", () => {
  const ready = { channel: "linkedin", state: "ready", canPublish: true };
  const emptyWebsite = {
    articleId: "article-1",
    published: false,
    publishedRevisionNumber: null,
  };

  it("keeps destinations independent across every selected-channel combination", () => {
    for (const selected of [
      [],
      ["portfolio"],
      ["linkedin"],
      ["x"],
      ["portfolio", "linkedin"],
      ["portfolio", "x"],
      ["linkedin", "x"],
      ["portfolio", "linkedin", "x"],
    ]) {
      for (const destination of ["portfolio", "linkedin", "x"]) {
        const result = getDestinationActions({
          destination,
          selected: selected.includes(destination),
          approved: true,
          readiness:
            destination === "linkedin"
              ? ready
              : { channel: "x", state: "ready", canPublish: true },
          delivery: null,
          website: emptyWebsite,
          revisionNumber: 2,
        });
        assert.equal(
          result.canPublish,
          selected.includes(destination),
          `${selected.join(",")} -> ${destination}`,
        );
      }
    }
  });

  it("fails closed for stale or ineligible revisions and a blocked X cost gate", () => {
    const base = {
      destination: "linkedin",
      selected: true,
      approved: false,
      readiness: ready,
      delivery: null,
      website: emptyWebsite,
      revisionNumber: 1,
    };
    assert.equal(getDestinationActions(base).canPublish, false);
    assert.equal(
      getDestinationActions({
        ...base,
        destination: "x",
        approved: true,
        readiness: { channel: "x", state: "cost_blocked", canPublish: false },
      }).canPublish,
      false,
    );
  });

  it("allows retry only for a definitive failed outcome and manual reconciliation for unknown", () => {
    const base = {
      destination: "linkedin",
      selected: true,
      approved: true,
      readiness: ready,
      website: emptyWebsite,
      revisionNumber: 3,
    };
    const failed = getDestinationActions({
      ...base,
      delivery: { state: "failed" },
    });
    const unknown = getDestinationActions({
      ...base,
      delivery: { state: "unknown" },
    });
    const succeeded = getDestinationActions({
      ...base,
      delivery: { state: "succeeded" },
    });
    assert.equal(failed.canRetry, true);
    assert.equal(failed.canReconcile, false);
    assert.equal(unknown.canRetry, false);
    assert.equal(unknown.canReconcile, true);
    assert.equal(succeeded.canRetry, false);
  });

  it("defaults article canonical URLs to the public production origin", () => {
    assert.equal(
      canonicalArticleUrl("atomic-cas"),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
    assert.equal(
      canonicalArticleUrl("atomic-cas", "  "),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
    assert.equal(
      canonicalArticleUrl("atomic-cas", "https://example.com/custom"),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
    assert.equal(
      canonicalArticleUrl(
        "atomic-cas",
        "https://jorgedelacruzpadilla.dev/articles/atomic-cas?utm=1",
      ),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas?utm=1",
    );
    assert.equal(
      canonicalArticleUrl(
        "atomic-cas",
        "http://jorgedelacruzpadilla.dev/articles/atomic-cas",
      ),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
    assert.equal(
      canonicalArticleUrl("atomic-cas", "javascript:alert(1)"),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
    assert.equal(
      canonicalArticleUrl("atomic-cas", "//evil.example/phish"),
      "https://jorgedelacruzpadilla.dev/articles/atomic-cas",
    );
  });

  it("shows the exact final social copy including the canonical URL", () => {
    const url = "https://jorgedelacruz.dev/articles/example";
    assert.equal(
      finalLinkedInCopy("Article summary", ["engineering"]),
      "Article summary\n\n#engineering",
    );
    assert.deepEqual(finalXCopy(["Thread opening", "Final post"], url), [
      "Thread opening",
      "Final post\n\n" + url,
    ]);
  });

  it("sends exact revision, channel, hash and an idempotency key through the admin API", async () => {
    adminApiClient.defaults.baseURL = "http://localhost:3003";
    setAdminCsrfToken("csrf-test-token");
    let captured;
    adminApiClient.defaults.adapter = async (config) => {
      captured = config;
      return {
        status: 201,
        statusText: "Created",
        headers: {},
        config,
        data: { delivery: { state: "queued" } },
      };
    };
    await adminApi.publishArticleChannel(
      "article-1",
      {
        revisionId: "revision-2",
        revisionNumber: 2,
        contentSha256: "ab".repeat(32),
        channel: "linkedin",
      },
      "client-key-00000001",
    );
    assert.equal(captured.url, "/admin/articles/article-1/deliveries");
    const sentBody =
      typeof captured.data === "string"
        ? JSON.parse(captured.data)
        : captured.data;
    assert.equal(sentBody.revisionId, "revision-2");
    assert.equal(sentBody.channel, "linkedin");
    assert.equal(
      captured.headers.get("Idempotency-Key"),
      "client-key-00000001",
    );
    assert.equal(captured.headers.get("x-csrf-token"), "csrf-test-token");
  });

  it("binds website publication to the exact revision, portfolio channel, and action key", async () => {
    let captured;
    adminApiClient.defaults.adapter = async (config) => {
      captured = config;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: { published: true },
      };
    };
    await adminApi.publishWebsiteArticle(
      "article-1",
      "revision-2",
      2,
      "cd".repeat(32),
      "website-key-00000001",
    );
    const sentBody =
      typeof captured.data === "string"
        ? JSON.parse(captured.data)
        : captured.data;
    assert.equal(captured.url, "/admin/articles/article-1/publication");
    assert.equal(sentBody.destination, "portfolio");
    assert.equal(sentBody.revisionId, "revision-2");
    assert.equal(sentBody.revisionNumber, 2);
    assert.equal(sentBody.contentSha256, "cd".repeat(32));
    assert.equal(
      captured.headers.get("Idempotency-Key"),
      "website-key-00000001",
    );
  });

  it("binds website unpublish to the exact currently published revision", async () => {
    let captured;
    adminApiClient.defaults.adapter = async (config) => {
      captured = config;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: { published: false },
      };
    };
    await adminApi.unpublishWebsiteArticle(
      "article-1",
      "revision-2",
      2,
      "ef".repeat(32),
      "website-key-00000002",
    );
    const sentBody =
      typeof captured.data === "string"
        ? JSON.parse(captured.data)
        : captured.data;
    assert.equal(sentBody.command, "unpublish");
    assert.equal(sentBody.revisionId, "revision-2");
    assert.equal(sentBody.revisionNumber, 2);
    assert.equal(sentBody.contentSha256, "ef".repeat(32));
    assert.equal(
      captured.headers.get("Idempotency-Key"),
      "website-key-00000002",
    );
  });

  it("renders native keyboard-operable controls with an accessible delivery section", async () => {
    const vite = await createServer({
      configFile: "vite.config.ts",
      server: { middlewareMode: true },
      appType: "custom",
    });
    try {
      const { ArticleDeliveryControls } = await vite.ssrLoadModule(
        "/components/admin/ArticleDeliveryControls.tsx",
      );
      const { createElement } = await import("react");
      const { renderToStaticMarkup } = await import("react-dom/server");
      const article = {
        id: "article-1",
        currentDraftRevision: {
          id: "revision-2",
          revisionNumber: 2,
          contentSha256: "ab".repeat(32),
          publicContent: {
            slug: "example",
            title: "Example",
            excerpt: "Summary",
            targetChannels: ["portfolio"],
            seo: { canonicalUrl: null },
            socialVariants: { linkedin: null, x: null },
          },
        },
      };
      const markup = renderToStaticMarkup(
        createElement(ArticleDeliveryControls, { article, review: null }),
      );
      assert.match(markup, /aria-labelledby="article-delivery-heading"/);
      assert.match(markup, /<button type="button"/);
      assert.match(markup, /Review and publish/);
      assert.doesNotMatch(markup, /role="button"/);
    } finally {
      await vite.close();
    }
  });
});
