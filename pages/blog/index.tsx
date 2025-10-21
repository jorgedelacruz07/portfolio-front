import { NextPage } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { TPost } from "../../types/post";
import Link from "next/link";
import { useGetPosts } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Blog: NextPage = () => {
  const { data: posts = [], isLoading, error } = useGetPosts();

  if (isLoading) {
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
            Error loading blog posts
          </h1>
          <p className="text-muted-foreground text-lg">
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
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Blog <span className="text-primary">Posts</span>
              </h1>
              <div className="ml-3 md:ml-4 h-1 w-12 md:w-16 bg-primary"></div>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
              Thoughts, insights, and experiences from my journey in software
              development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No blog posts available at the moment.
                </p>
              </div>
            ) : (
              posts.map((post: TPost) => (
                <Card
                  key={post.slug}
                  className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20 bg-card"
                >
                  <CardHeader className="pb-4">
                    <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={post.image?.src || "/images/placeholder.jpg"}
                        alt={post.title || "Blog post"}
                        width={800}
                        height={450}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors duration-300">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title || "Untitled"}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground font-medium">
                      {post.updatedAt
                        ? format(new Date(post.updatedAt), "MMM dd yyyy")
                        : "No date"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.body || "No content available"}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4 pt-0">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
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
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
