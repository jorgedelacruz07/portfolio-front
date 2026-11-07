import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { adminApi } from "@/lib/admin-api";
import { ArticleDeliveryControls } from "@/components/admin/ArticleDeliveryControls";
import type {
  Article,
  ArticleChannel,
  ArticleClaim,
  ArticleContentType,
  ArticlePrivacyClassification,
  ArticleReference,
  ArticleReview,
  ArticleSummary,
  ReviewState,
} from "@/types/article";

const inputClass =
  "w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50";
const labelClass = "space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `key-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface DraftFormData {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  contentMarkdown: string;
  contentType: ArticleContentType;
  targetChannels: ArticleChannel[];
  privacyClassification: ArticlePrivacyClassification;
  sourceProject: string;
  sourceCaseStudyId: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  linkedinText: string;
  linkedinHashtags: string;
  xPosts: string[];
  references: ArticleReference[];
  claims: ArticleClaim[];
}

const emptyFormData: DraftFormData = {
  slug: "",
  title: "",
  subtitle: "",
  excerpt: "",
  contentMarkdown: "",
  contentType: "engineering-note",
  targetChannels: ["portfolio"],
  privacyClassification: "public-source",
  sourceProject: "",
  sourceCaseStudyId: "",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  keywords: "",
  linkedinText: "",
  linkedinHashtags: "",
  xPosts: [""],
  references: [],
  claims: [],
};

function stateBadge(state: ReviewState) {
  switch (state) {
    case "approved":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-400 border border-emerald-500/20">
          Approved
        </span>
      );
    case "in_review":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-blue-400 border border-blue-500/20">
          In Review
        </span>
      );
    case "changes_requested":
      return (
        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-rose-400 border border-rose-500/20">
          Changes Requested
        </span>
      );
    case "draft":
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-amber-400 border border-amber-500/20">
          Draft
        </span>
      );
  }
}

export function ArticleEditor() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [reviewState, setReviewState] = useState<ArticleReview | null>(null);
  const [formData, setFormData] = useState<DraftFormData>(emptyFormData);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [reviewActionStatus, setReviewActionStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [previewTab, setPreviewTab] = useState<"markdown" | "linkedin" | "x">("markdown");

  const wordCount = useMemo(() => {
    return formData.contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
  }, [formData.contentMarkdown]);

  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  async function loadArticles() {
    setIsLoading(true);
    try {
      const res = await adminApi.listArticles();
      setArticles(res.items || []);
    } catch {
      setStatusMessage("Failed to load articles from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function selectArticle(id: string) {
    setIsCreatingNew(false);
    setSelectedArticleId(id);
    setSaveStatus("idle");
    setStatusMessage(null);
    try {
      const article = await adminApi.getArticle(id);
      setSelectedArticle(article);
      const rev = article.currentDraftRevision;
      const pub = rev.publicContent;

      setFormData({
        slug: article.slug,
        title: pub.title,
        subtitle: pub.subtitle || "",
        excerpt: pub.excerpt,
        contentMarkdown: pub.contentMarkdown,
        contentType: article.contentType,
        targetChannels: [...pub.targetChannels],
        privacyClassification: "public-source",
        sourceProject: "",
        sourceCaseStudyId: "",
        metaTitle: pub.seo.metaTitle || "",
        metaDescription: pub.seo.metaDescription || "",
        canonicalUrl: pub.seo.canonicalUrl || "",
        keywords: pub.seo.keywords.join(", "),
        linkedinText: pub.socialVariants.linkedin?.text || "",
        linkedinHashtags: (pub.socialVariants.linkedin?.hashtags || []).join(", "),
        xPosts: pub.socialVariants.x?.posts?.length ? [...pub.socialVariants.x.posts] : [""],
        references: [...pub.references],
        claims: [...pub.claims],
      });

      try {
        const revState = await adminApi.getArticleReview(article.id, rev.revisionNumber);
        setReviewState(revState);
      } catch {
        setReviewState(null);
      }
    } catch {
      setStatusMessage("Could not load article details.");
    }
  }

  function startNewArticle() {
    setSelectedArticleId(null);
    setSelectedArticle(null);
    setReviewState(null);
    setFormData(emptyFormData);
    setIsCreatingNew(true);
    setStatusMessage(null);
  }

  function toggleChannel(channel: ArticleChannel) {
    const current = formData.targetChannels;
    if (current.includes(channel)) {
      if (current.length > 1) {
        setFormData({ ...formData, targetChannels: current.filter((c) => c !== channel) });
      }
    } else {
      setFormData({ ...formData, targetChannels: [...current, channel] });
    }
  }

  function updateXPost(index: number, val: string) {
    const next = [...formData.xPosts];
    next[index] = val;
    setFormData({ ...formData, xPosts: next });
  }

  function addXPost() {
    if (formData.xPosts.length < 10) {
      setFormData({ ...formData, xPosts: [...formData.xPosts, ""] });
    }
  }

  function removeXPost(index: number) {
    if (formData.xPosts.length > 1) {
      setFormData({ ...formData, xPosts: formData.xPosts.filter((_, i) => i !== index) });
    }
  }

  function addReference() {
    setFormData({
      ...formData,
      references: [...formData.references, { id: `ref-${formData.references.length + 1}`, title: "", url: "" }],
    });
  }

  function updateReference(index: number, key: keyof ArticleReference, val: string) {
    const next = [...formData.references];
    next[index] = { ...next[index], [key]: val };
    setFormData({ ...formData, references: next });
  }

  function removeReference(index: number) {
    setFormData({
      ...formData,
      references: formData.references.filter((_, i) => i !== index),
    });
  }

  function addClaim() {
    setFormData({
      ...formData,
      claims: [
        ...formData.claims,
        { id: `claim-${formData.claims.length + 1}`, kind: "opinion", statement: "", referenceIds: [] },
      ],
    });
  }

  function updateClaim(index: number, key: keyof ArticleClaim, val: unknown) {
    const next = [...formData.claims];
    next[index] = { ...next[index], [key]: val } as ArticleClaim;
    setFormData({ ...formData, claims: next });
  }

  function removeClaim(index: number) {
    setFormData({
      ...formData,
      claims: formData.claims.filter((_, i) => i !== index),
    });
  }

  function buildDraftPayload() {
    const keywords = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const linkedinHashtags = formData.linkedinHashtags
      .split(",")
      .map((h) => h.trim().replace(/^#/, ""))
      .filter(Boolean);

    const xPosts = formData.xPosts.map((p) => p.trim()).filter(Boolean);

    return {
      format: "portfolio-article-draft",
      version: 2,
      article: {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        excerpt: formData.excerpt.trim(),
        contentMarkdown: formData.contentMarkdown,
        contentType: formData.contentType,
        targetChannels: formData.targetChannels,
        seo: {
          metaTitle: formData.metaTitle.trim() || undefined,
          metaDescription: formData.metaDescription.trim() || undefined,
          canonicalUrl: formData.canonicalUrl.trim() || undefined,
          keywords: keywords.length ? keywords : undefined,
        },
        socialVariants: {
          ...(formData.targetChannels.includes("linkedin") && formData.linkedinText.trim()
            ? {
                linkedin: {
                  text: formData.linkedinText.trim(),
                  hashtags: linkedinHashtags.length ? linkedinHashtags : undefined,
                },
              }
            : {}),
          ...(formData.targetChannels.includes("x") && xPosts.length
            ? {
                x: {
                  posts: xPosts,
                },
              }
            : {}),
        },
        references: formData.references.length
          ? formData.references.filter((r) => r.id && r.title && r.url)
          : undefined,
        claims: formData.claims.length ? formData.claims.filter((c) => c.id && c.statement) : undefined,
      },
      evidence: {
        privacyClassification: formData.privacyClassification,
        sourceProject: formData.sourceProject.trim() || undefined,
        sourceCaseStudyId: formData.sourceCaseStudyId.trim() || undefined,
      },
    };
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaveStatus("saving");
    setStatusMessage(null);

    const draft = buildDraftPayload();
    const key = randomId();

    try {
      if (isCreatingNew || !selectedArticle) {
        const result = await adminApi.createArticleDraft(draft, key);
        setSaveStatus("saved");
        setStatusMessage(
          `Article draft created successfully: ${result.article.title} (Revision #1). Remember: Drafts are unapproved by default.`,
        );
        await loadArticles();
        await selectArticle(result.article.id);
      } else {
        const result = await adminApi.createArticleRevision(
          selectedArticle.id,
          selectedArticle.latestRevisionNumber,
          draft,
          key,
        );
        setSaveStatus("saved");
        setStatusMessage(
          `New revision #${result.article.latestRevisionNumber} created successfully. Previous revisions remain preserved as immutable snapshots.`,
        );
        await loadArticles();
        await selectArticle(selectedArticle.id);
      }
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err: unknown) {
      setSaveStatus("error");
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        setStatusMessage(`Save failed: ${err.response.data.error.message}`);
      } else {
        setStatusMessage("Save failed. Check input formatting and ensure your session is active.");
      }
    }
  }

  async function handleReviewCommand(command: "submit" | "approve" | "request_changes" | "revoke") {
    if (!selectedArticle) return;
    setReviewActionStatus("submitting");
    setStatusMessage(null);

    const key = randomId();
    const currentRevNumber = selectedArticle.latestRevisionNumber;

    try {
      await adminApi.decideArticleReview(
        selectedArticle.id,
        currentRevNumber,
        command,
        reviewNote.trim() || undefined,
        key,
      );
      setReviewActionStatus("done");
      setReviewNote("");
      setStatusMessage(`Decision recorded: ${command.toUpperCase()}. Note: Editorial approval does not publish.`);
      const updatedReview = await adminApi.getArticleReview(selectedArticle.id, currentRevNumber);
      setReviewState(updatedReview);
      setTimeout(() => setReviewActionStatus("idle"), 2000);
    } catch (err: unknown) {
      setReviewActionStatus("error");
      if (axios.isAxiosError(err) && err.response?.data?.error?.message) {
        setStatusMessage(`Review action failed: ${err.response.data.error.message}`);
      } else {
        setStatusMessage("Review action failed. Please check blockers and try again.");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Technical Articles Workspace</h2>
          <p className="text-xs text-muted-foreground">
            Create, version, and review technical articles for Portfolio, LinkedIn and X. Revisions are immutable
            snapshots.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewArticle}
          className="rounded-lg bg-primary px-3 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          + New Article Draft
        </button>
      </div>

      {statusMessage ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-border bg-card/60 p-3 text-xs text-foreground"
        >
          {statusMessage}
        </div>
      ) : null}

      {/* Article List Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 && !isLoading ? (
          <div className="col-span-full rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No technical articles created yet. Click "+ New Article Draft" above to begin.
          </div>
        ) : null}

        {articles.map((art) => (
          <button
            key={art.id}
            type="button"
            onClick={() => selectArticle(art.id)}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
              selectedArticleId === art.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card/40 hover:bg-card/70"
            }`}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {art.contentType}
              </span>
              <span className="font-mono text-[10px] font-semibold text-primary">Rev #{art.latestRevisionNumber}</span>
            </div>
            <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-foreground">{art.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{art.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {art.targetChannels.map((ch) => (
                <span key={ch} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {ch}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Editor View */}
      {selectedArticle || isCreatingNew ? (
        <form onSubmit={handleSave} className="craft-card space-y-6 rounded-xl p-6">
          <div className="border-b border-border pb-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-primary">
                  {isCreatingNew ? "Create New Article" : `Editing: ${selectedArticle?.title}`}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {isCreatingNew
                    ? "Initial Article Draft (v2)"
                    : `Revision #${selectedArticle?.latestRevisionNumber} Details`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {reviewState ? stateBadge(reviewState.state) : null}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArticleId(null);
                    setSelectedArticle(null);
                    setIsCreatingNew(false);
                  }}
                  className="rounded-lg border border-border px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-muted"
                >
                  Close Editor
                </button>
              </div>
            </div>

            {/* Editorial Review & Lifecycle explainer */}
            <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-blue-300">Editorial Lifecycle: Draft → In Review → Approved</p>
              <p className="mt-1">
                Saving changes creates a new immutable revision snapshot using Compare-And-Set concurrency. Editorial
                approval validates quality criteria and evidence rules; it does <strong>not</strong> publish to
                channels.
              </p>
            </div>
          </div>

          {/* Review Decision Controls (For existing revisions) */}
          {reviewState && selectedArticle ? (
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <h4 className="font-mono text-xs font-semibold uppercase text-primary">Editorial Review Status</h4>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs text-foreground">State: {stateBadge(reviewState.state)}</span>
                {reviewState.blockers.length ? (
                  <span className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-xs text-rose-300 border border-rose-500/20">
                    Blockers: {reviewState.blockers.join(", ")}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400">No active blockers.</span>
                )}
              </div>

              {/* Review Actions */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Optional decision note"
                  className={`${inputClass} sm:max-w-xs`}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {reviewState.state === "draft" ? (
                    <button
                      type="button"
                      disabled={reviewActionStatus === "submitting"}
                      onClick={() => handleReviewCommand("submit")}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                      Submit for Review
                    </button>
                  ) : null}

                  {reviewState.state === "in_review" ? (
                    <>
                      <button
                        type="button"
                        disabled={reviewActionStatus === "submitting" || reviewState.blockers.length > 0}
                        onClick={() => handleReviewCommand("approve")}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                        title={
                          reviewState.blockers.length
                            ? "Resolve blockers before approving"
                            : "Approve editorial revision"
                        }
                      >
                        Approve Revision
                      </button>
                      <button
                        type="button"
                        disabled={reviewActionStatus === "submitting"}
                        onClick={() => handleReviewCommand("request_changes")}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
                      >
                        Request Changes
                      </button>
                    </>
                  ) : null}

                  {reviewState.state === "approved" || reviewState.state === "in_review" ? (
                    <button
                      type="button"
                      disabled={reviewActionStatus === "submitting"}
                      onClick={() => handleReviewCommand("revoke")}
                      className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:bg-muted"
                    >
                      Revoke Decision
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Decision History */}
              {reviewState.decisions.length ? (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-mono text-[11px] text-muted-foreground">Decision History:</p>
                  <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                    {reviewState.decisions.map((dec) => (
                      <li key={dec.sequence}>
                        #{dec.sequence} <strong>{dec.command.toUpperCase()}</strong> ({dec.fromState} → {dec.toState})
                        by {dec.actor.email} on {new Date(dec.createdAt).toLocaleDateString()}{" "}
                        {dec.note ? `• "${dec.note}"` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {selectedArticle && !isCreatingNew ? (
            <ArticleDeliveryControls article={selectedArticle} review={reviewState} />
          ) : null}

          {/* Primary Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Content Type
              <select
                className={inputClass}
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ArticleContentType })}
              >
                <option value="engineering-note">Engineering Note</option>
                <option value="tutorial">Tutorial</option>
                <option value="case-study">Case Study</option>
                <option value="commentary">Commentary</option>
              </select>
            </label>

            <label className={labelClass}>
              Slug (URL Identifier)
              <input
                className={inputClass}
                value={formData.slug}
                disabled={!isCreatingNew}
                placeholder="e.g. distributed-lock-redis"
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Article Title
              <input
                className={inputClass}
                value={formData.title}
                placeholder="Clear technical headline"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Subtitle (Optional)
              <input
                className={inputClass}
                value={formData.subtitle}
                placeholder="Technical context or summary phrase"
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Public Excerpt
              <textarea
                className={`${inputClass} min-h-20`}
                value={formData.excerpt}
                placeholder="Concise 1-3 sentence summary for previews and social feeds"
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
              />
            </label>

            {/* Target Channels */}
            <div className={`${labelClass} sm:col-span-2`}>
              <span>Target Distribution Channels (Required)</span>
              <div className="mt-2 flex flex-wrap gap-4">
                {(["portfolio", "linkedin", "x"] as ArticleChannel[]).map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 font-mono text-xs normal-case text-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetChannels.includes(ch)}
                      onChange={() => toggleChannel(ch)}
                    />
                    {ch === "portfolio"
                      ? "Portfolio Website"
                      : ch === "linkedin"
                        ? "LinkedIn Post"
                        : "X (Twitter) Thread"}
                  </label>
                ))}
              </div>
            </div>

            {/* Markdown Body */}
            <label className={`${labelClass} sm:col-span-2`}>
              <div className="flex items-center justify-between">
                <span>Article Markdown</span>
                <span className="font-mono text-[11px] normal-case text-muted-foreground">
                  {wordCount} words • ~{readingMinutes} min read
                </span>
              </div>
              <textarea
                className={`${inputClass} min-h-64 font-mono text-xs leading-relaxed`}
                value={formData.contentMarkdown}
                placeholder="Write article body in CommonMark / GFM..."
                onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                required
              />
            </label>
          </div>

          {/* Social Copy & Preview Tabs */}
          <div className="rounded-xl border border-border p-4">
            <h4 className="font-mono text-xs font-semibold uppercase text-primary">Channel Variants & Previews</h4>
            <div className="mt-3 flex border-b border-border">
              <button
                type="button"
                onClick={() => setPreviewTab("markdown")}
                className={`border-b-2 px-4 py-2 font-mono text-xs ${
                  previewTab === "markdown"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                Website Preview
              </button>
              {formData.targetChannels.includes("linkedin") ? (
                <button
                  type="button"
                  onClick={() => setPreviewTab("linkedin")}
                  className={`border-b-2 px-4 py-2 font-mono text-xs ${
                    previewTab === "linkedin"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  LinkedIn Copy ({formData.linkedinText.length}/3000)
                </button>
              ) : null}
              {formData.targetChannels.includes("x") ? (
                <button
                  type="button"
                  onClick={() => setPreviewTab("x")}
                  className={`border-b-2 px-4 py-2 font-mono text-xs ${
                    previewTab === "x"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  X Thread ({formData.xPosts.length} posts)
                </button>
              ) : null}
            </div>

            <div className="mt-4">
              {previewTab === "markdown" ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Estimated rendering on Portfolio website:</p>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
                    <h1 className="text-xl font-bold text-foreground">{formData.title || "Untitled Article"}</h1>
                    {formData.subtitle ? <p className="text-sm text-muted-foreground">{formData.subtitle}</p> : null}
                    <div className="mt-4 whitespace-pre-wrap font-mono text-xs text-foreground/80">
                      {formData.contentMarkdown.slice(0, 500) || "No content written yet."}
                      {formData.contentMarkdown.length > 500 ? "..." : ""}
                    </div>
                  </div>
                </div>
              ) : null}

              {previewTab === "linkedin" ? (
                <div className="space-y-4">
                  <label className={labelClass}>
                    LinkedIn Commentary
                    <textarea
                      className={`${inputClass} min-h-24`}
                      value={formData.linkedinText}
                      maxLength={3000}
                      placeholder="Post text formatted for LinkedIn professional audience..."
                      onChange={(e) => setFormData({ ...formData, linkedinText: e.target.value })}
                    />
                  </label>
                  <label className={labelClass}>
                    Hashtags (Comma separated)
                    <input
                      className={inputClass}
                      value={formData.linkedinHashtags}
                      placeholder="e.g. TypeScript, DistributedSystems, Node"
                      onChange={(e) => setFormData({ ...formData, linkedinHashtags: e.target.value })}
                    />
                  </label>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
                    <p className="font-mono text-[10px] uppercase text-muted-foreground">LinkedIn Live Preview:</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                      {formData.linkedinText || "No LinkedIn copy entered."}
                    </p>
                    {formData.linkedinHashtags ? (
                      <p className="mt-2 text-xs text-blue-400">
                        {formData.linkedinHashtags
                          .split(",")
                          .map((h) => `#${h.trim().replace(/^#/, "")}`)
                          .join(" ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {previewTab === "x" ? (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">X Thread Posts (Max 10 posts, 280 code-points each):</p>
                  {formData.xPosts.map((post, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                        <span>Post #{idx + 1}</span>
                        <span className={post.length > 280 ? "text-rose-400 font-bold" : ""}>
                          {post.length}/280 chars
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <textarea
                          className={`${inputClass} min-h-16`}
                          value={post}
                          maxLength={280}
                          placeholder={`Post ${idx + 1} content...`}
                          onChange={(e) => updateXPost(idx, e.target.value)}
                        />
                        {formData.xPosts.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeXPost(idx)}
                            className="rounded-lg border border-border px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                          >
                            ✕
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {formData.xPosts.length < 10 ? (
                    <button
                      type="button"
                      onClick={addXPost}
                      className="rounded-lg border border-border px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-muted"
                    >
                      + Add Post to Thread
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          {/* References & Claims */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* References */}
            <div className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-semibold uppercase text-primary">
                  References ({formData.references.length})
                </h4>
                <button
                  type="button"
                  onClick={addReference}
                  className="rounded border border-border px-2 py-0.5 font-mono text-[11px] hover:bg-muted"
                >
                  + Add Ref
                </button>
              </div>
              {formData.references.map((ref, i) => (
                <div key={i} className="space-y-1.5 rounded border border-border/60 p-2">
                  <div className="flex justify-between">
                    <input
                      className={`${inputClass} text-xs py-1`}
                      value={ref.id}
                      placeholder="ref id (e.g. ref-rfc-7231)"
                      onChange={(e) => updateReference(i, "id", e.target.value)}
                    />
                    <button type="button" onClick={() => removeReference(i)} className="ml-2 text-rose-400 text-xs">
                      ✕
                    </button>
                  </div>
                  <input
                    className={`${inputClass} text-xs py-1`}
                    value={ref.title}
                    placeholder="Reference Title"
                    onChange={(e) => updateReference(i, "title", e.target.value)}
                  />
                  <input
                    className={`${inputClass} text-xs py-1`}
                    value={ref.url}
                    placeholder="https://..."
                    onChange={(e) => updateReference(i, "url", e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Claims */}
            <div className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-semibold uppercase text-primary">
                  Claims ({formData.claims.length})
                </h4>
                <button
                  type="button"
                  onClick={addClaim}
                  className="rounded border border-border px-2 py-0.5 font-mono text-[11px] hover:bg-muted"
                >
                  + Add Claim
                </button>
              </div>
              {formData.claims.map((claim, i) => (
                <div key={i} className="space-y-1.5 rounded border border-border/60 p-2">
                  <div className="flex justify-between gap-2">
                    <input
                      className={`${inputClass} text-xs py-1`}
                      value={claim.id}
                      placeholder="claim id"
                      onChange={(e) => updateClaim(i, "id", e.target.value)}
                    />
                    <select
                      className={`${inputClass} text-xs py-1 w-28`}
                      value={claim.kind}
                      onChange={(e) => updateClaim(i, "kind", e.target.value)}
                    >
                      <option value="opinion">Opinion</option>
                      <option value="fact">Fact</option>
                    </select>
                    <button type="button" onClick={() => removeClaim(i)} className="ml-1 text-rose-400 text-xs">
                      ✕
                    </button>
                  </div>
                  <textarea
                    className={`${inputClass} text-xs py-1 min-h-12`}
                    value={claim.statement}
                    placeholder="Statement text"
                    onChange={(e) => updateClaim(i, "statement", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy and Evidence Boundary notice */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
            <h4 className="font-mono text-xs font-semibold uppercase text-primary">
              Private Evidence Boundary & Provenance
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Internal source commit hashes, study manifests and private claims remain stored server-side and are never
              projected into public responses, SEO headers or social payloads.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className={labelClass}>
                Privacy Classification
                <select
                  className={inputClass}
                  value={formData.privacyClassification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacyClassification: e.target.value as ArticlePrivacyClassification,
                    })
                  }
                >
                  <option value="public-source">public-source</option>
                  <option value="private-source">private-source</option>
                </select>
              </label>

              <label className={labelClass}>
                Source Project (Optional)
                <input
                  className={inputClass}
                  value={formData.sourceProject}
                  placeholder="e.g. portfolio"
                  onChange={(e) => setFormData({ ...formData, sourceProject: e.target.value })}
                />
              </label>

              <label className={labelClass}>
                Source Case Study ID (Optional)
                <input
                  className={inputClass}
                  value={formData.sourceCaseStudyId}
                  placeholder="e.g. cs-2026-01"
                  onChange={(e) => setFormData({ ...formData, sourceCaseStudyId: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Save / Create Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <p className="font-mono text-xs text-muted-foreground">
              {isCreatingNew
                ? "Creating draft will submit initial revision #1."
                : `Saving will create immutable revision #${(selectedArticle?.latestRevisionNumber || 1) + 1}.`}
            </p>

            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-primary px-5 py-2 font-mono text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Saving..." : isCreatingNew ? "Create Article Draft" : "Save as New Revision"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
