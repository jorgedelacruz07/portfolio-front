import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Newspaper, X } from "lucide-react";

import { PageSkeleton } from "@/components/PageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import { SearchField } from "@/components/ui/search-field";
import { useGetArticles, useSiteContent } from "@/hooks";
import { PUBLIC_SITE_ORIGIN } from "@/lib/article-delivery";
import { cn } from "@/lib/utils";
import type { ArticleContentType, PublicArticleSummary } from "@/types/article";

const CONTENT_TYPE_LABELS: Record<ArticleContentType, string> = {
  "case-study": "Case Study",
  tutorial: "Tutorial",
  "engineering-note": "Engineering Note",
  commentary: "Commentary",
};

function formatPublishedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export default function ArticlesPage() {
  const { data: articles = [], isLoading, error } = useGetArticles();
  const { copy } = useSiteContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredArticles = useMemo(() => {
    return articles.filter((article: PublicArticleSummary) => {
      if (selectedType !== "all" && article.contentType !== selectedType) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesExcerpt = (article.excerpt || "").toLowerCase().includes(query);
        const matchesType = (article.contentType || "").toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesType;
      }

      return true;
    });
  }, [articles, selectedType, searchQuery]);

  if (isLoading) {
    return <PageSkeleton variant="articles" />;
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          heading="h1"
          icon={<X className="h-5 w-5" />}
          title={copy["articles.errorTitle"]}
          description={copy["articles.errorDescription"]}
        >
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Try again
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  const filtering = Boolean(searchQuery) || selectedType !== "all";

  return (
    <>
      <Helmet>
        <title>{copy["articles.seoTitle"]}</title>
        <meta name="description" content={copy["articles.seoDescription"]} />
        <link rel="canonical" href={`${PUBLIC_SITE_ORIGIN}/articles`} />
        <meta property="og:title" content={copy["articles.seoTitle"]} />
        <meta property="og:description" content={copy["articles.seoDescription"]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${PUBLIC_SITE_ORIGIN}/articles`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={copy["articles.seoTitle"]} />
        <meta name="twitter:description" content={copy["articles.seoDescription"]} />
      </Helmet>

      <PageContainer className="space-y-10">
        <PageHeader
          eyebrow={copy["articles.eyebrow"]}
          title={copy["articles.title"]}
          description={copy["articles.description"]}
        />

        {articles.length > 0 ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter articles by type">
              <button
                type="button"
                aria-pressed={selectedType === "all"}
                onClick={() => setSelectedType("all")}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm",
                  selectedType === "all"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                All types
              </button>
              {(Object.keys(CONTENT_TYPE_LABELS) as ArticleContentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selectedType === type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm",
                    selectedType === type
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {CONTENT_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
            <div className="w-full sm:max-w-xs">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                label={copy["articles.searchLabel"]}
                placeholder={copy["articles.search"]}
              />
            </div>
          </div>
        ) : null}

        {filteredArticles.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="h-5 w-5" />}
            title={filtering ? copy["articles.noMatchTitle"] : copy["articles.emptyTitle"]}
            description={filtering ? copy["articles.noMatchDescription"] : copy["articles.emptyDescription"]}
          >
            {filtering ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                }}
              >
                Reset filters
              </Button>
            ) : null}
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredArticles.map((article: PublicArticleSummary) => (
              <article
                key={article.id}
                className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge>{CONTENT_TYPE_LABELS[article.contentType] || article.contentType}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {article.readingTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    <Link to={`/articles/${article.slug}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {article.title}
                    </Link>
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{formatPublishedDate(article.publishedAt)}</span>
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    Read article
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
