import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPosts } from "@/hooks";
import type { TPost } from "@/types/post";

export default function BlogPage() {
  const { data: posts = [], isLoading, error } = useGetPosts();

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
            Error loading blog posts
          </h1>
          <p className="text-lg text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog | Jorge de la Cruz</title>
        <meta
          name="description"
          content="Thoughts, insights, and engineering notes from frontend, product, and software delivery work."
        />
      </Helmet>

      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 text-center md:space-y-4">
              <div className="mb-3 flex items-center justify-center md:mb-4">
                <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                  Blog <span className="text-primary">Posts</span>
                </h1>
                <div className="ml-3 h-1 w-12 bg-primary md:ml-4 md:w-16" />
              </div>
              <p className="mx-auto max-w-2xl px-4 text-base text-muted-foreground md:text-lg">
                Thoughts, insights, and experiences from my journey in software
                development.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {posts.length === 0 ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-lg text-muted-foreground">
                    No blog posts available at the moment.
                  </p>
                </div>
              ) : (
                posts.map((post: TPost) => (
                  <Card
                    key={post.slug}
                    className="group border-border/50 bg-card transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 hover:shadow-lg"
                  >
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                        <OptimizedImage
                          src={post.image?.src || "/images/placeholder.jpg"}
                          alt={post.title || "Blog post"}
                          width={800}
                          height={450}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary md:text-2xl">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title || "Untitled"}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-sm font-medium text-muted-foreground">
                        {post.updatedAt
                          ? format(new Date(post.updatedAt), "MMM dd yyyy")
                          : "No date"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3 md:pb-4">
                      <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                        {post.body || "No content available"}
                      </p>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-0 md:gap-4">
                      {post.categories?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <Badge
                              key={category.id}
                              variant="secondary"
                              className="bg-muted/50 text-xs font-medium transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {post.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link to={`/blog/${post.slug}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
