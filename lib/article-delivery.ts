import type {
  ArticleChannelDelivery,
  ArticleChannelReadiness,
  ArticleChannel,
  WebsitePublicationStatus,
} from "../types/article";

export type DeliveryDestination = ArticleChannel;

export const PUBLIC_SITE_ORIGIN = "https://jorgedelacruzpadilla.dev";

export function canonicalArticleUrl(slug: string, configuredUrl?: string | null): string {
  const fallback = `${PUBLIC_SITE_ORIGIN}/articles/${encodeURIComponent(slug)}`;
  try {
    if (typeof configuredUrl !== "string") return fallback;
    const configured = configuredUrl.trim();
    if (!configured) return fallback;
    const url = new URL(configured);
    if (url.protocol !== "https:" || url.origin !== PUBLIC_SITE_ORIGIN) {
      return fallback;
    }
    if (url.username || url.password) return fallback;
    return url.href;
  } catch {
    return fallback;
  }
}

export function finalLinkedInCopy(text: string, hashtags: readonly string[]): string {
  const tags = hashtags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
  const copy = [text.trim(), tags.join(" ")].filter(Boolean).join("\n\n");
  return copy;
}

export function finalXCopy(posts: readonly string[], url: string): string[] {
  if (posts.length === 0) return [];
  const last = posts[posts.length - 1].trim();
  return last.includes(url) ? [...posts] : [...posts.slice(0, -1), `${last}\n\n${url}`];
}

export function canRetryDelivery(delivery: ArticleChannelDelivery | null): boolean {
  return delivery?.state === "failed";
}

export function getDestinationActions(input: {
  destination: ArticleChannel;
  selected: boolean;
  approved: boolean;
  readiness?: ArticleChannelReadiness;
  delivery: ArticleChannelDelivery | null;
  website: WebsitePublicationStatus | null;
  revisionId?: string;
  revisionNumber: number;
}) {
  const published =
    input.destination === "portfolio" && input.website?.publishedRevisionNumber === input.revisionNumber;
  const ready = input.destination === "portfolio" || input.readiness?.canPublish === true;
  return {
    canPublish:
      input.selected && input.approved && ready && !published && (input.destination === "portfolio" || !input.delivery),
    canRetry: input.destination !== "portfolio" && canRetryDelivery(input.delivery) && ready,
    canReconcile: input.destination !== "portfolio" && input.delivery?.state === "unknown",
    canUnpublish:
      input.destination === "portfolio" &&
      input.website?.published === true &&
      input.website.publishedRevisionNumber === input.revisionNumber &&
      input.website.publishedRevisionId === input.revisionId,
    published,
  };
}

export function deliveryReadinessText(readiness?: ArticleChannelReadiness): string {
  if (!readiness) return "Readiness unavailable";
  switch (readiness.state) {
    case "ready":
      return "Connected and ready";
    case "not_configured":
      return "Provider setup is incomplete";
    case "not_connected":
      return "Account is not connected";
    case "cost_blocked":
      return "Blocked until X paid access is explicitly approved";
  }
}
