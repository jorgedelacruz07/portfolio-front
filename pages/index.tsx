import type { GetStaticProps, NextPage } from "next";
import { HomeBlog } from "../components/pages/home/HomeBlog";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeProjects } from "../components/pages/home/HomeProjects";
import { HomeSocial } from "../components/pages/home/HomeSocial";
import { HomeExperiences } from "../components/pages/home/HomeExperiences";
import { TProject } from "../types/project";
import { TExperience } from "../types/experience";
import { TPost } from "../types/post";
import axios from "axios";

export const getStaticProps: GetStaticProps = async () => {
  let experiences: TExperience[] = [];
  let projects: TProject[] = [];
  let posts: TPost[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    experiences = await axios
      .get(`${url}/client/experiences`)
      .then((res) => res.data);
    projects = await axios
      .get(`${url}/client/projects`)
      .then((res) => res.data);
    posts = await axios
      .get(`${url}/client/posts`)
      .then((res) => res.data.slice(0, 5));
  } catch (error) {
    let message = "";
    if (axios.isAxiosError(error)) {
      message = error?.response?.statusText as string;
    }
    console.error({ error: message });
  }

  return {
    props: {
      experiences,
      projects,
      posts,
    },
    revalidate: 10,
  };
};

type Props = {
  experiences: TExperience[];
  projects: TProject[];
  posts: TPost[];
};

const Home: NextPage<Props> = ({ experiences, projects, posts }) => {
  return (
    <>
      <HomeProfile />
      {experiences && <HomeExperiences experiences={experiences} />}
      {projects && <HomeProjects projects={projects} />}
      <HomeSocial />
      {posts.length > 0 && <HomeBlog posts={posts} />}
    </>
  );
};

export default Home;
