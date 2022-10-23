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
    posts = await axios.get(`${url}/client/posts`).then((res) => res.data);
  } catch (error) {
    console.error({ error });
  }

  return {
    props: {
      experiences,
      projects,
      posts,
    },
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
      <HomeExperiences experiences={experiences} />
      <HomeProjects projects={projects} />
      <HomeSocial />
      <HomeBlog posts={posts} />
    </>
  );
};

export default Home;
