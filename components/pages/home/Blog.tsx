import Link from "next/link";

export const Blog = () => {
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
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">Blog</h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                className="hover:text-blue-600"
                href={`/blog/${post.slug}`}
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
