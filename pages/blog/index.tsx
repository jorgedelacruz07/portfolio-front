import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { TPost } from "../../types/post";

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
  };
};

type Props = {
  posts: TPost[];
};

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Blog</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="my-16">
            <h3 className="text-xl md:text-2xl uppercase">
              <Link
                href={{
                  pathname: "/blog/[id]",
                  query: {
                    id: post.id,
                  },
                }}
              >
                <a className="hover:text-blue-600">{post.title}</a>
              </Link>
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {post.createdAt}
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
