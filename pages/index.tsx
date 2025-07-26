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
    const [experiencesRes, projectsRes, postsRes] = await Promise.all([
      axios.get(`${url}/client/experiences?limit=3`),
      axios.get(`${url}/client/projects?limit=3`),
      axios.get(`${url}/client/posts?limit=3`)
    ]);
    
    experiences = experiencesRes.data.slice(0, 3);
    projects = projectsRes.data.slice(0, 3);
    posts = postsRes.data.slice(0, 3);
  } catch (error) {
    console.error('[getStaticProps] Failed to fetch homepage data:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
      url: axios.isAxiosError(error) ? error.config?.url : undefined,
    });
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
    <div className="container mx-auto space-y-8">
      <HomeProfile />
      {experiences && <HomeExperiences experiences={experiences} />}
      {projects && <HomeProjects projects={projects} />}
    </div>
  );
};

export default Home;
