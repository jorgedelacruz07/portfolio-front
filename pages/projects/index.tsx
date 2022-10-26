import type { GetStaticProps, NextPage } from "next";
import { TProject } from "../../types/project";
import axios from "axios";

export const getStaticProps: GetStaticProps = async () => {
  let projects: TProject[] = [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  try {
    projects = await axios
      .get(`${url}/client/projects`)
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
      projects,
    },
  };
};

type Props = {
  projects: TProject[];
};

const Projects: NextPage<Props> = ({ projects }) => {
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Projects</h1>
      <div>
        {projects.map((project) => (
          <div key={project.id} className="my-16">
            <h3 className="md:text-2xl uppercase">{project.name}</h3>
            <div className="my-6">
              <div className="my-2">
                <a className="hover:text-blue-600" href={project.url} rel="">
                  {project.url}
                </a>
              </div>
              <div className="my-2">
                <div className="italic">{project.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
