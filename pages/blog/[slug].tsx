import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { TPost } from "../../types/post";
import { format } from "date-fns";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let post = null;

  const url = process.env.NEXT_PUBLIC_API_URL;
  const slug = params?.slug;

  try {
    post = await axios
      .get(`${url}/client/posts/${slug}`)
      .then((res) => res.data);
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
};

type Props = {
  post: TPost;
};

const PostPage: NextPage<Props> = ({ post }) => {
  return (
    post && (
      <>
        <h1 className="text-2xl md:text-3xl text-center uppercase font-bold">
          {post.title}
        </h1>
        <div className="py-12 md:py-16">
          <div className="text-sm text-gray-800 dark:text-gray-300">
            {`Created at ${format(
              new Date(post.createdAt),
              "dd/MM/yyyy hh:mm"
            )}`}
          </div>
          {post?.image?.src && (
            <div className="my-6 text-center">
              <Image
                src={post?.image?.src}
                className="w-full"
                alt=""
                width={400}
                height={400}
              />
            </div>
          )}
          <div className="my-6">
            <div
              className="my-2"
              dangerouslySetInnerHTML={{ __html: post?.body }}
            />
          </div>
        </div>
      </>
    )
  );
};

export default PostPage;
