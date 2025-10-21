import { NextPage } from "next";
import { useRouter } from "next/router";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useGetPostBySlug } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";


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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading post</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Link href="/blog" className="text-cyan-600 hover:text-cyan-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
          <Link href="/blog" className="text-cyan-600 hover:text-cyan-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            {post.image?.src && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={post.image.src}
                  alt={post.title}
                  width={64}
                  height={64}
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                      >
                        <Link href={`/blog?tag=${tag.name}`}>{tag.name}</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
            <Link href="/blog">
              <>
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
              </>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;
