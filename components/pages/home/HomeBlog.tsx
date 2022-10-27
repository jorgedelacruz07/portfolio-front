import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { TPost } from "../../../types/post";

type Props = {
  posts: TPost[];
};

export const HomeBlog: FC<Props> = ({ posts }) => {
  return (
    <div className="my-4 md:my-8">
      <h3 className="text-xl md:text-2xl">Blog</h3>
      <div className="py-4 md:py-6">
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <div className="flex gap-4 items-center">
                <div className="max-w-[40px] md:max-w-[90px]">
                  <Image
                    src={post?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg"
                    alt=""
                    width={180}
                    height={180}
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
                    <a className="text-sm md:text-base">{post.title}</a>
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
