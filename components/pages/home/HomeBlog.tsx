import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { TPost } from "../../../types/post";

type Props = {
  posts: TPost[];
};

export const HomeBlog: FC<Props> = ({ posts }) => {
  return (
    <div className="my-6 md:my-10">
      <h3 className="text-xl md:text-2xl">Blog</h3>
      <div className="pt-4 md:pt-6">
        <ul>
          {posts.map((post) => (
            <li key={post.slug} className="mb-4">
              <div className="flex gap-4 items-center">
                <div className="max-w-[30px] md:max-w-[40px] flex items-center">
                  <Image
                    src={post?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg"
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <Link
                    href={{
                      pathname: "/blog/[slug]",
                      query: {
                        slug: post.slug,
                      },
                    }}
                    target="_blank"
                  >
                    <a className="text-blue-700 hover:text-blue-900 dark:text-gray-200 dark:hover:text-gray-400 text-sm md:text-base">
                      {post.title}
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
