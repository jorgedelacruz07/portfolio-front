import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Newspaper, Search, X } from "lucide-react";

import { PageSkeleton } from "@/components/PageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetArticles } from "@/hooks";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredArticles = useMemo(() => {
    return articles.filter((article: PublicArticleSummary) => {
      // Content type filter
      if (selectedType !== "all" && article.contentType !== selectedType) {
        return false;
      }

      // Search query
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
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="craft-card w-full space-y-4 rounded-2xl p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <X className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Error loading articles</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {error instanceof Error ? error.message : "Unable to retrieve the articles catalog."}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Articles & Engineering Notes | Jorge de la Cruz</title>
        <meta
          name="description"
          content="Deep-dives into software architecture, systems engineering, distributed systems, and craft."
        />
        <link rel="canonical" href="https://jorgedelacruz.dev/articles" />
        <meta property="og:title" content="Articles & Engineering Notes | Jorge de la Cruz" />
        <meta
          property="og:description"
          content="Deep-dives into software architecture, systems engineering, distributed systems, and craft."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jorgedelacruz.dev/articles" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Articles & Engineering Notes | Jorge de la Cruz" />
        <meta
          name="twitter:description"
          content="Deep-dives into software architecture, systems engineering, distributed systems, and craft."
        />
      </Helmet>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Technical Publications</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Articles & Engineering Notes
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical reflections, architectural case studies, and tutorials on building reliable software systems.
          </p>
        </div>

        {/* Filters and search */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Type filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter articles by type">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className="h-8 text-xs font-medium"
            >
              All Types
            </Button>
            {(Object.keys(CONTENT_TYPE_LABELS) as ArticleContentType[]).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="h-8 text-xs font-medium"
              >
                {CONTENT_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
              className="h-9 w-full rounded-lg border border-input bg-card/60 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Article Grid */}
        <div className="mt-8">
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
              <Newspaper className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h2 className="mt-4 text-base font-semibold text-foreground">No articles found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || selectedType !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Check back soon for new technical writings and deep-dives."}
              </p>
              {(searchQuery || selectedType !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                  }}
                  className="mt-4"
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredArticles.map((article: PublicArticleSummary) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="craft-card group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/90 p-6 shadow-soft transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="text-[11px] font-medium uppercase tracking-wider text-primary"
                      >
                        {CONTENT_TYPE_LABELS[article.contentType] || article.contentType}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{article.readingTimeMinutes} min read</span>
                      </div>
                    </div>

                    <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      <Link to={`/articles/${article.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {article.title}
                      </Link>
                    </h2>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
                    <span>{formatPublishedDate(article.publishedAt)}</span>
                    <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                      Read article
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
