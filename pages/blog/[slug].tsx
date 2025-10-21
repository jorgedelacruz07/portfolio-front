import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { TPost } from "../../types/post";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let post = null;

  const url = process.env.NEXT_PUBLIC_API_URL;
  const slug = params?.slug;

  try {
    post = await axios
      .get(`${url}/client/posts/${slug}`)
      .then((res) => res.data);
  } catch (error) {
    console.error('[Blog slug getStaticProps] Failed to fetch blog post:', {
      slug,
      message: error instanceof Error ? error.message : 'Unknown error',
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
      url: axios.isAxiosError(error) ? error.config?.url : undefined,
    });
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

type Props = {
  post: TPost;
};

const PostPage: NextPage<Props> = ({ post }) => {
  if (!post) return null;

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
