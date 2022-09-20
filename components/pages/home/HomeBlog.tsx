import Link from "next/link";
import { posts } from "../../../data/content";

export const HomeBlog = () => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">Blog</h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                className="hover:text-blue-600"
                href={{
                  pathname: "/blog/[slug]",
                  query: {
                    slug: post.slug,
                  },
                }}
                target="_blank"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
