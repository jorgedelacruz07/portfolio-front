import { format } from "date-fns";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TPost } from "@/types/post";
import { Badge } from "@/components/ui/badge";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { homePageStyles } from "@/lib/utils";

type HomeBlogProps = {
  posts: TPost[];
};

const BlogPostCard = ({ post }: { post: TPost }) => {
  return (
    <article className={homePageStyles.spotlightCard}>
      <div className="flex items-start gap-4">
        {post.image?.src ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <OptimizedImage
              src={post.image.src}
              alt={post.title}
              className="h-full w-full object-cover"
              width={56}
              height={56}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {format(new Date(post.createdAt), "MMM d, yyyy")}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            <Link
              to={`/blog/${post.slug}`}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
          </h3>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
        {post.body}
      </p>

      <div className={homePageStyles.metaList}>
        {post.categories?.slice(0, 2).map((category) => (
          <Badge
            key={category.id}
            variant="secondary"
            className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground"
          >
            {category.name}
          </Badge>
        ))}
        {post.tags?.slice(0, 2).map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground"
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </article>
  );
};

export const HomeBlog = ({ posts }: HomeBlogProps) => {
  return (
    <HomeSection
      eyebrow="Writing"
      title="Notes on engineering, product craft, and frontend systems."
      description="Recent articles that reflect how I think about implementation detail, UX quality, and team delivery."
      actionHref="/blog"
      actionLabel="All posts"
    >
      <div className={homePageStyles.featuredGrid}>
        {posts.slice(0, 3).map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </HomeSection>
  );
};
