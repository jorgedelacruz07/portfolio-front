import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetPostBySlug } from "@/hooks";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useGetPostBySlug(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Error loading post
          </h1>
          <p className="text-lg text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">Post not found</h1>
          <Button variant="outline" asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Jorge de la Cruz`}</title>
        <meta
          name="description"
          content={post.body?.slice(0, 160) || post.title}
        />
      </Helmet>

      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="space-y-8">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                {post.image?.src ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg ring-2 ring-border/50">
                    <OptimizedImage
                      src={post.image.src}
                      alt={post.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground md:text-5xl">
                    {post.title}
                  </h1>
                  {post.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          <Link
                            to={`/blog?tag=${encodeURIComponent(tag.name)}`}
                          >
                            {tag.name}
                          </Link>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time dateTime={post.createdAt}>
                  {format(new Date(post.createdAt), "MMMM dd, yyyy")}
                </time>
              </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </div>

            <footer className="border-t border-border/40 pt-8">
              <Button variant="outline" asChild>
                <Link to="/blog" className="inline-flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Blog
                </Link>
              </Button>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
