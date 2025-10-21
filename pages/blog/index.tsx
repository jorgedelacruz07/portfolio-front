import { NextPage } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { TPost } from "../../types/post";
import Link from "next/link";
import { useGetPosts } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading blog posts</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-cyan-600 hover:text-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Blog Posts
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No blog posts available at the moment.</p>
            </div>
          ) : (
            posts.map((post: TPost, index: number) => (
              <div key={post.slug} className="group">
                <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <Image
                        src={post.image?.src || '/images/placeholder.jpg'}
                        alt={post.title || 'Blog post'}
                        width={800}
                        height={450}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold text-black dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                        <Link href={`/blog/${post.slug}`}>{post.title || 'Untitled'}</Link>
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 font-semibold">
                        <span>
                          {post.updatedAt ? format(new Date(post.updatedAt), "MMM dd yyyy") : 'No date'}
                        </span>
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
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {post.body || 'No content available'}
                      </p>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
