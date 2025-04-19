import type { GetStaticProps, NextPage } from "next";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeProjects } from "../components/pages/home/HomeProjects";
import { TProject } from "../types/project";
import { TExperience } from "../types/experience";
import { TPost } from "../types/post";
import axios from "axios";
import HomeExperiences from "../components/pages/home/HomeExperiences";

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
    revalidate: 60,
  };
};

type Props = {
  experiences: TExperience[];
  projects: TProject[];
  posts: TPost[];
};

const Home: NextPage<Props> = ({ experiences, projects, posts }) => {
  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      <HomeProfile />
      {experiences && <HomeExperiences experiences={experiences} />}
      {projects && <HomeProjects projects={projects} />}
    </div>
  );
};

export default Home;
