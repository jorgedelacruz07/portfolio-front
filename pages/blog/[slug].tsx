import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { slug } = router.query;

  console.log({ slug });

  return (
    <>
      <p>Post {slug}</p>
    </>
  );
};

export default Post;
