import { NextPage } from "next";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useGetPostBySlug } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: post, isLoading, error } = useGetPostBySlug(slug);

  if (router.isFallback || isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Error loading post
          </h1>
          <p className="text-muted-foreground text-lg">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button variant="outline" asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Post not found</h1>
          <Button variant="outline" asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              {post.image?.src && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-2 ring-border/50">
                  <Image
                    src={post.image.src}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="object-cover"
                    sizes="80px"
                    priority
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          <Link href={`/blog?tag=${tag.name}`}>{tag.name}</Link>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), "MMMM dd, yyyy")}
              </time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>

          {/* Footer */}
          <footer className="pt-8 border-t border-border/40">
            <Button variant="outline" asChild>
              <Link href="/blog" className="inline-flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
  );
};

export default PostPage;
