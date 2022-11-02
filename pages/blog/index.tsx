import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { TCategory } from "../../types/post";
import { format } from "date-fns";
import { TPost } from "../../types/post";

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
    revalidate: 10,
  };
};

type Props = {
  postCategories: TCategory[];
};

const Blog: NextPage<Props> = ({ postCategories }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-center uppercase font-bold">
        Blog
      </h1>
      <div className="py-12 md:py-16">
        {postCategories.map(
          (postCategory) =>
            postCategory.posts.length > 0 && (
              <div key={postCategory.slug}>
                <h3 className="text-lg md:text-2xl font-semibold uppercase">
                  {`Category: ${postCategory.name}`}
                </h3>
                <div className="my-6">
                  {postCategory?.posts.map((post: TPost) => (
                    <div key={post.slug} className="mb-12 md:mb-16">
                      <div className="flex items-center gap-6">
                        <div className="max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">
                          <Image
                            src={post?.image?.src || "/images/placeholder.jpg"}
                            className="rounded-2xl"
                            alt=""
                            width={120}
                            height={120}
                          />
                        </div>
                        <div>
                          <h3 className="my-2 text-base md:text-lg uppercase font-semibold">
                            <Link
                              href={{
                                pathname: "/blog/[slug]",
                                query: {
                                  slug: post.slug,
                                },
                              }}
                            >
                              <a className="text-blue-700 hover:text-blue-900 dark:text-blue-600 dark:hover:text-blue-800 text-base md:text-lg">
                                {post.title}
                              </a>
                            </Link>
                          </h3>
                          <div className="my-2 text-sm italic text-gray-800 dark:text-gray-300 font-medium">
                            {format(
                              new Date(post.updatedAt),
                              "MMM dd yyyy - hh:mm"
                            )}
                          </div>
                          <div className="my-2">
                            {post?.tags?.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs md:text-sm font-semibold leading-none text-white bg-blue-500 rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Blog;
