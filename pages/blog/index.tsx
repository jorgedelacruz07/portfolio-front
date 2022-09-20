import { NextPage } from "next";
import Link from "next/link";

const Blog: NextPage = () => {
  const posts = [
    {
      id: 1,
      slug: "title-01",
      title: "Title 01",
      body: "This is a post called Title 01",
      createdAt: "2022-09-20 00:00:00",
    },
    {
      id: 2,
      slug: "title-02",
      title: "Title 02",
      body: "This is a post called Title 02",
      createdAt: "2022-09-20 00:00:00",
    },
    {
      id: 3,
      slug: "title-03",
      title: "Title 03",
      body: "This is a post called Title 03",
      createdAt: "2022-09-20 00:00:00",
    },
    {
      id: 4,
      slug: "title-04",
      title: "Title 04",
      body: "This is a post called Title 04",
      createdAt: "2022-09-20 00:00:00",
    },
    {
      id: 5,
      slug: "title-05",
      title: "Title 05",
      body: "This is a post called Title 05",
      createdAt: "2022-09-20 00:00:00",
    },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Blog</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="my-16">
            <h3 className="text-xl md:text-2xl uppercase">
              <Link href={`/blog/${post.slug}`}>
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
