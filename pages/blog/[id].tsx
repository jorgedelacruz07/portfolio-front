import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { TPost } from "../../types/post";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let post;

  const url = process.env.NEXT_PUBLIC_API_URL;
  const id = params?.id;

  try {
    post = await axios.get(`${url}/client/posts/${id}`).then((res) => res.data);
  } catch (error) {
    console.error({ error });
  }

  return {
    props: {
      post,
    },
  };
};

type Props = {
  post: TPost;
};

const PostPage: NextPage<Props> = ({ post }) => {
  return (
    <>
      <h2 className="text-3xl uppercase">{post.title}</h2>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {post.createdAt}
      </div>
      <div className="my-6">
        <div
          className="my-2"
          dangerouslySetInnerHTML={{ __html: post?.body }}
        />
      </div>
    </>
  );
};

export default PostPage;
