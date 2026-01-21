import { memo } from "react";
import { TPost } from "@/types/post";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export type BlogCardProps = {
  post: TPost;
};

export const BlogCard = memo<BlogCardProps>(({ post }) => {
  return (
    <div className="group h-full">
      <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={post.image.src}
                alt={post.title}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="text-lg font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-300">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {post.body}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 font-semibold">
              <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

BlogCard.displayName = "BlogCard";
