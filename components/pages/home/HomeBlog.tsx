import { memo } from "react";
import { TPost } from "../../../types/post";
import Link from "next/link";
import { BlogCard } from "@/components/cards/BlogCard";

type Props = {
  posts: TPost[];
};

const HomeBlog = ({ posts }: Props) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Latest Posts
        </h2>
        <div className="text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
          <Link href="/blog">View All</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default memo(HomeBlog);
