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
            <li key={post.id}>
              <Link
                className="hover:text-blue-600"
                href={{
                  pathname: "/blog/[id]",
                  query: {
                    id: post.id,
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
