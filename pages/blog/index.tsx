import { NextPage } from "next";
import Link from "next/link";
import { posts } from "../../data/content";

const Blog: NextPage = () => {
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Blog</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="my-16">
            <h3 className="text-xl md:text-2xl uppercase">
              <Link
                href={{
                  pathname: "/blog/[slug]",
                  query: {
                    slug: post.slug,
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
              <div className="my-2">{post.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
