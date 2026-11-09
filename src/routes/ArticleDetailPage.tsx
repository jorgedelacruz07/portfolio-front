import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Newspaper,
  Share2,
} from "lucide-react";

import { PageSkeleton } from "@/components/PageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkedinIcon } from "@/components/svgs/Linkedin";
import { SafeMarkdown, isSafeUrl } from "@/components/articles/SafeMarkdown";
import { useGetArticleBySlug } from "@/hooks";
import {
  PUBLIC_SITE_ORIGIN,
  canonicalArticleUrl,
} from "@/lib/article-delivery";
import type { ArticleContentType } from "@/types/article";

const CONTENT_TYPE_LABELS: Record<ArticleContentType, string> = {
  "case-study": "Case Study",
  tutorial: "Tutorial",
  "engineering-note": "Engineering Note",
  commentary: "Commentary",
};

function formatFullDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useGetArticleBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <PageSkeleton variant="article" />;
  }

  // Fail-closed not-found state when article is missing, unpublished, or error occurs
  if (error || !article || !article.publicContent) {
    return (
      <>
        <Helmet>
          <title>Article Not Found | Jorge de la Cruz</title>
          <meta
            name="description"
            content="The requested article does not exist or has not been published."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <div className="w-full space-y-4 rounded-lg border border-border bg-card p-8">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Newspaper className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground">404</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Article not found
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This article does not exist, may have been unpublished, or is
              currently an unapproved draft. Only explicitly published technical
              revisions are available.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/articles" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Articles</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { publicContent } = article;
  const canonicalUrl = canonicalArticleUrl(
    article.slug,
    publicContent.seo?.canonicalUrl,
  );
  const metaTitle = publicContent.seo?.metaTitle || publicContent.title;
  const metaDescription =
    publicContent.seo?.metaDescription || publicContent.excerpt;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    publicContent.title,
  )}&url=${encodeURIComponent(canonicalUrl)}`;

  const shareOnLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;

  // Structured data (Schema.org TechArticle)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: publicContent.title,
    description: publicContent.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: "Jorge de la Cruz",
      url: PUBLIC_SITE_ORIGIN,
    },
    publisher: {
      "@type": "Person",
      name: "Jorge de la Cruz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${metaTitle} | Jorge de la Cruz`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OpenGraph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="article:published_time" content={article.publishedAt} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            <Badge>
              {CONTENT_TYPE_LABELS[article.contentType] || article.contentType}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {publicContent.readingTime?.minutes || 1} min read
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatFullDate(article.publishedAt)}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {publicContent.title}
          </h1>

          {publicContent.subtitle ? (
            <p className="text-lg leading-relaxed text-muted-foreground">
              {publicContent.subtitle}
            </p>
          ) : null}

          {publicContent.excerpt ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              {publicContent.excerpt}
            </p>
          ) : null}
        </header>

        {/* Main Content Body */}
        <section className="py-8">
          <SafeMarkdown
            content={publicContent.contentMarkdown}
            className="article-body"
          />
        </section>

        {/* References and Sources Section */}
        {publicContent.references && publicContent.references.length > 0 ? (
          <section
            className="mt-12 rounded-lg border border-border bg-card p-6"
            aria-labelledby="references-heading"
          >
            <h2
              id="references-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              References & Sources
            </h2>
            <ul className="mt-4 divide-y divide-border/40 text-sm">
              {publicContent.references.map((ref) => {
                const safe = isSafeUrl(ref.url);
                return (
                  <li key={ref.id} className="py-2.5 first:pt-0 last:pb-0">
                    {safe ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                      >
                        <span>{ref.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ) : (
                      <span className="font-medium text-foreground">
                        {ref.title}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {/* Claims Section */}
        {publicContent.claims && publicContent.claims.length > 0 ? (
          <section
            className="mt-8 rounded-lg border border-border bg-card p-6"
            aria-labelledby="claims-heading"
          >
            <h2
              id="claims-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Verified Statements
            </h2>
            <div className="mt-4 space-y-3">
              {publicContent.claims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/20 p-3 text-sm"
                >
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {claim.kind}
                  </Badge>
                  <p className="text-foreground/90">{claim.statement}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Share Section */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span>Share this article</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
            >
              <a
                href={shareOnTwitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Post on X"
              >
                <span>Post on X</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
            >
              <a
                href={shareOnLinkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon width={14} height={14} />
                <span>LinkedIn</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 gap-1.5 text-xs"
              aria-label={copied ? "Copied" : "Copy link"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy link"}</span>
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
}
