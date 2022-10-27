import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { TPost } from "../../types/post";
import { format } from "date-fns";

export const getStaticProps: GetStaticProps = async () => {
  let posts: TPost[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    posts = await axios.get(`${url}/client/posts`).then((res) => res.data);
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
};

type Props = {
  posts: TPost[];
};

const Blog: NextPage<Props> = ({ posts }) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl text-center uppercase">Blog</h1>
      <div className="py-16">
        {posts.map((post) => (
          <div key={post.slug} className="mb-16">
            <div className="flex gap-6 items-center">
              <div className="max-w-[70px] md:max-w-[80px] lg:max-w-[100px]">
                <Image
                  src={post?.image?.src || "/images/placeholder.jpg"}
                  className="rounded-2xl"
                  alt=""
                  width={180}
                  height={180}
                />
              </div>
              <div>
                <h3 className="text-base md:text-xl uppercase font-bold">
                  <Link
                    href={{
                      pathname: "/blog/[slug]",
                      query: {
                        slug: post.slug,
                      },
                    }}
                  >
                    <a className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-700">
                      {post.title}
                    </a>
                  </Link>
                </h3>
                <div className="text-sm italic text-gray-500 dark:text-gray-400">
                  {format(new Date(post.updatedAt), "dd MMM yyyy - hh:mm")}
                </div>
              </div>
            </div>
            <div className="my-6">
              <div
                className="my-2 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: post?.body }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
