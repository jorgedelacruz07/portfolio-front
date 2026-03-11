import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TPost } from "@/types/post";
import { Badge } from "@/components/ui/badge";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { cn, homeMotion, homePageStyles } from "@/lib/utils";

type HomeBlogProps = {
  posts: TPost[];
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ");

const BlogPostCard = ({ post }: { post: TPost }) => {
  return (
    <motion.article
      variants={homeMotion.item}
      className={cn(homePageStyles.spotlightCard, "h-full")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-20 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/25 aspect-[16/10]">
        {post.image?.src ? (
          <OptimizedImage
            src={post.image.src}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            width={960}
            height={640}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <Badge variant="secondary" className="px-2 py-0.5 text-[0.62rem]">
            {format(new Date(post.createdAt), "MMM d, yyyy")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
            <Link
              to={`/blog/${post.slug}`}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {stripHtml(post.body)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.categories?.slice(0, 2).map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="px-2 py-0.5 text-[0.62rem]"
            >
              {category.name}
            </Badge>
          ))}
          {post.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-2 py-0.5 text-[0.62rem]"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

export const HomeBlog = ({ posts }: HomeBlogProps) => {
  return (
    <HomeSection
      eyebrow="Writing"
      title="Notes on engineering, AI workflows, and product systems."
      description="Short writing on full-stack delivery, tooling, and implementation detail."
      actionHref="/blog"
      actionLabel="All posts"
    >
      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </HomeSection>
  );
};
