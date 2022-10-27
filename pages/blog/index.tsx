import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { TPost } from "../../types/post";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Blog</h1>
      <div className="py-16">
        {posts.map((post) => (
          <div key={post.id} className="mb-16">
            <div className="flex gap-6 items-center">
              {post?.image?.src && (
                <div className="max-w-[100px]">
                  <Image
                    src={post?.image?.src}
                    className="rounded-3xl"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
              )}
              <div>
                <h3 className="text-xl md:text-2xl uppercase">
                  <Link
                    href={{
                      pathname: "/blog/[slug]",
                      query: {
                        slug: post.slug,
                      },
                    }}
                  >
                    <a className="dark:text-blue-500 dark:hover:text-blue-600">
                      {post.title}
                    </a>
                  </Link>
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), "dd MMM yyyy hh:mm", {
                    locale: es,
                  })}
                </div>
              </div>
            </div>
            <div className="my-6">
              <div
                className="my-2"
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
