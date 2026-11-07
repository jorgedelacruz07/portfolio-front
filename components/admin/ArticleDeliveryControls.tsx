import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { canonicalArticleUrl, deliveryReadinessText, finalLinkedInCopy, finalXCopy, getDestinationActions } from "@/lib/article-delivery";
import type {
  Article,
  ArticleChannel,
  ArticleChannelDelivery,
  ArticleChannelReadiness,
  ArticleReview,
  WebsitePublicationStatus,
} from "@/types/article";

type Destination = ArticleChannel;
type Action = "publish" | "unpublish" | "retry" | "reconcile";

const DESTINATIONS: readonly Destination[] = ["portfolio", "linkedin", "x"];

function makeKey(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `delivery-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function errorMessage(error: unknown): string {
  const data = (error as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error;
  return data?.code ? `Request blocked (${data.code}).` : "The delivery request could not be completed.";
}

function stateLabel(state?: ArticleChannelDelivery["state"] | null): string {
  if (!state) return "Not published";
  return state.replaceAll("_", " ");
}

export function ArticleDeliveryControls({ article, review }: { article: Article; review: ArticleReview | null }) {
  const revision = article.currentDraftRevision;
  const content = revision.publicContent;
  const url = canonicalArticleUrl(content.slug, content.seo.canonicalUrl);
  const [readiness, setReadiness] = useState<ArticleChannelReadiness[]>([]);
  const [deliveries, setDeliveries] = useState<Partial<Record<"linkedin" | "x", ArticleChannelDelivery | null>>>({});
  const [website, setWebsite] = useState<WebsitePublicationStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ destination: Destination; action: Action } | null>(null);
  const [remotePostExists, setRemotePostExists] = useState<boolean | null>(null);
  const [providerPostId, setProviderPostId] = useState("");

  const eligibleByReview = review?.revisionId === revision.id && review.state === "approved" && review.blockers.length === 0;
  const readinessByChannel = useMemo(() => new Map(readiness.map((item) => [item.channel, item])), [readiness]);

  const refresh = useCallback(async () => {
    try {
      const [ready, web, linkedin, x] = await Promise.all([
        adminApi.getArticleDeliveryReadiness(article.id),
        adminApi.getWebsitePublication(article.id),
        adminApi.getArticleChannelDelivery(article.id, revision.revisionNumber, "linkedin"),
        adminApi.getArticleChannelDelivery(article.id, revision.revisionNumber, "x"),
      ]);
      setReadiness(ready.channels);
      setWebsite(web);
      setDeliveries({ linkedin: linkedin.delivery, x: x.delivery });
    } catch {
      setMessage("Delivery status is temporarily unavailable. No action was sent.");
    }
  }, [article.id, revision.revisionNumber]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function performAction() {
    if (!confirmation) return;
    const { destination, action } = confirmation;
    setBusy(true);
    setMessage(null);
    try {
      if (destination === "portfolio") {
        if (action === "publish") await adminApi.publishWebsiteArticle(
          article.id,
          revision.id,
          revision.revisionNumber,
          revision.contentSha256,
          makeKey(),
        );
        else if (action === "unpublish") await adminApi.unpublishWebsiteArticle(
          article.id,
          revision.id,
          revision.revisionNumber,
          revision.contentSha256,
          makeKey(),
        );
      } else {
        const current = deliveries[destination] ?? null;
        if (action === "publish") {
          await adminApi.publishArticleChannel(article.id, {
            revisionId: revision.id,
            revisionNumber: revision.revisionNumber,
            contentSha256: revision.contentSha256,
            channel: destination,
          }, makeKey());
        } else if (action === "retry" && current) {
          await adminApi.retryArticleChannel(article.id, revision.revisionNumber, destination, current.idempotencyKey);
        } else if (action === "reconcile" && current) {
          await adminApi.reconcileArticleChannel(
            article.id,
            revision.revisionNumber,
            destination,
            current.idempotencyKey,
            remotePostExists
              ? { remotePostExists: true, providerPostId: providerPostId.trim() }
              : { remotePostExists: false },
          );
        }
      }
      setConfirmation(null);
      setProviderPostId("");
      setRemotePostExists(null);
      setMessage(`${destination[0].toUpperCase()}${destination.slice(1)} action recorded for revision #${revision.revisionNumber}.`);
      await refresh();
    } catch (error) {
      setMessage(errorMessage(error));
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const expectedVisibility: Record<Destination, string> = {
    portfolio: "Public on the Portfolio website",
    linkedin: "Public post on the owner’s LinkedIn member profile",
    x: "Public post or thread on X",
  };

  function preview(destination: Destination): string[] {
    if (destination === "portfolio") return [content.title, content.subtitle ?? "", content.excerpt, content.contentMarkdown, url].filter(Boolean);
    if (destination === "linkedin") {
      return [finalLinkedInCopy(content.socialVariants.linkedin?.text ?? "", content.socialVariants.linkedin?.hashtags ?? [])];
    }
    return finalXCopy(content.socialVariants.x?.posts ?? [], url);
  }

  return (
    <section aria-labelledby="article-delivery-heading" className="space-y-4 rounded-xl border border-border bg-card/50 p-4">
      <div>
        <h4 id="article-delivery-heading" className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Publish by destination</h4>
        <p className="mt-1 text-xs text-muted-foreground">Each action applies to immutable revision #{revision.revisionNumber} ({revision.id}). Eligibility is checked again by the API when you confirm.</p>
      </div>
      {message ? <p role="status" className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="grid gap-3 lg:grid-cols-3">
        {DESTINATIONS.map((destination) => {
          const social = destination !== "portfolio";
          const delivery = social ? deliveries[destination] ?? null : null;
          const ready = social ? readinessByChannel.get(destination) : undefined;
          const selected = content.targetChannels.includes(destination);
          const actions = getDestinationActions({
            destination,
            selected,
            approved: eligibleByReview,
            readiness: ready,
            delivery,
            website,
            revisionId: revision.id,
            revisionNumber: revision.revisionNumber,
          });
          const published = actions.published;
          return (
            <article key={destination} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-semibold capitalize text-foreground">{destination === "portfolio" ? "Portfolio" : destination}</h5>
                <span className="rounded bg-muted px-2 py-1 font-mono text-[11px] capitalize text-muted-foreground">
                  {destination === "portfolio" ? (published ? "published" : website?.published ? "another revision live" : "not published") : stateLabel(delivery?.state)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {destination === "portfolio" ? "Website revision pointer" : deliveryReadinessText(ready)}
              </p>
              {!selected ? <p className="mt-2 text-xs text-amber-300">This destination is not selected in this revision.</p> : null}
              {delivery?.errorCode ? <p className="mt-2 break-words font-mono text-xs text-rose-300">{delivery.errorCode}</p> : null}
              {delivery?.providerPostId ? <p className="mt-2 break-all text-xs text-muted-foreground">Provider post ID: {delivery.providerPostId}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={!actions.canPublish || busy} onClick={() => setConfirmation({ destination, action: "publish" })} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
                  Review and publish
                </button>
                {actions.canUnpublish ? (
                  <button type="button" disabled={busy} onClick={() => setConfirmation({ destination, action: "unpublish" })} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground disabled:opacity-40">Unpublish website</button>
                ) : null}
                {actions.canRetry ? (
                  <button type="button" disabled={busy} onClick={() => setConfirmation({ destination, action: "retry" })} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground disabled:opacity-40">Review retry</button>
                ) : null}
                {actions.canReconcile ? (
                  <button type="button" disabled={busy} onClick={() => setConfirmation({ destination, action: "reconcile" })} className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs text-amber-200">Reconcile manually</button>
                ) : null}
              </div>
              {social && delivery?.state === "unknown" ? <p className="mt-2 text-xs text-amber-200">Check the provider directly before reconciling. Retry is disabled until the outcome is confirmed.</p> : null}
              {destination === "portfolio" && website?.published && !published ? <p className="mt-2 text-xs text-muted-foreground">A different immutable revision is currently public.</p> : null}
            </article>
          );
        })}
      </div>
      {confirmation ? (
        <dialog open aria-labelledby="delivery-confirm-title" aria-modal="true" className="fixed inset-0 z-50 m-auto max-h-[90vh] w-[min(42rem,calc(100%-2rem))] overflow-y-auto rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl backdrop:bg-black/70">
          <h4 id="delivery-confirm-title" className="text-lg font-semibold">Confirm {confirmation.action} to {confirmation.destination}</h4>
          <p className="mt-2 text-sm text-muted-foreground">Revision #{revision.revisionNumber} · {revision.id} · SHA-256 {revision.contentSha256}</p>
          <p className="mt-2 text-sm">Expected visibility: {expectedVisibility[confirmation.destination]}.</p>
          <p className="mt-1 break-all text-sm">Canonical article URL: <a className="underline" href={url} target="_blank" rel="noreferrer">{url}</a></p>
          <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-3">
            <p className="font-mono text-xs uppercase text-muted-foreground">Final copy</p>
            {preview(confirmation.destination).map((line, index) => <pre key={index} className="whitespace-pre-wrap break-words text-sm font-sans">{line}</pre>)}
          </div>
          {confirmation.action === "reconcile" ? (
            <fieldset className="mt-4 space-y-3">
              <legend className="text-sm font-semibold">What did you verify on the provider?</legend>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="reconciliation-result" checked={remotePostExists === true} onChange={() => setRemotePostExists(true)} />I found the post</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="reconciliation-result" checked={remotePostExists === false} onChange={() => setRemotePostExists(false)} />I checked and confirmed no post exists</label>
              {remotePostExists === true ? <label className="block text-sm">Verified provider post ID<input value={providerPostId} onChange={(event) => setProviderPostId(event.target.value)} className="mt-1 w-full rounded border border-border bg-background p-2" required /></label> : null}
            </fieldset>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" disabled={busy} onClick={() => setConfirmation(null)} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
            <button type="button" disabled={busy || (confirmation.action === "reconcile" && (remotePostExists === null || (remotePostExists && !providerPostId.trim())))} onClick={() => void performAction()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
              {busy ? "Working…" : confirmation.action === "publish" ? `Confirm publish to ${confirmation.destination}` : confirmation.action === "unpublish" ? "Confirm unpublish" : confirmation.action === "retry" ? "Confirm one manual retry" : "Record verified outcome"}
            </button>
          </div>
        </dialog>
      ) : null}
    </section>
  );
}
