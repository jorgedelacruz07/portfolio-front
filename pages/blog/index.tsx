import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { TPost } from "../../types/post";
import { TCategory } from "../../types/category";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  let postCategories: TCategory[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    postCategories = await axios
      .get(`${url}/client/categories`)
      .then((res) => res.data);
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      postCategories,
    },
    revalidate: 60,
  };
};

type Props = {
  postCategories: TCategory[];
};

const Blog: NextPage<Props> = ({ postCategories }) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Blog Posts
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postCategories.map(
            (postCategory) =>
              postCategory.posts.length > 0 &&
              postCategory.posts.map((post: TPost) => (
                <div key={post.slug} className="group">
                  <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <Image
                          src={post.image.src}
                          alt={post.title}
                          width={800}
                          height={450}
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-black dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 font-semibold">
                          <span>
                            {format(new Date(post.updatedAt), "MMM dd yyyy")}
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
                          {post.body}
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
