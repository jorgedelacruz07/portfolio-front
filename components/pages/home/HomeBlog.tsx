import Link from "next/link";
import { FC } from "react";
import { TPost } from "../../../types/post";

type Props = {
  posts: TPost[];
};

export const HomeBlog: FC<Props> = ({ posts }) => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">Blog</h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={{
                  pathname: "/blog/[slug]",
                  query: {
                    slug: post.slug,
                  },
                }}
                target="_blank"
              >
                <a className="dark:text-blue-500 dark:hover:text-blue-600">
                  {post.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
