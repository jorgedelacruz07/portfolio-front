import type { GetStaticProps, NextPage } from "next";
import { TProject } from "../../types/project";
import axios from "axios";
import Image from "next/image";

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
    revalidate: 10,
  };
};

type Props = {
  projects: TProject[];
};

const Projects: NextPage<Props> = ({ projects }) => {
  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Projects</h1>
      <div className="py-16">
        {projects.map((project) => (
          <div key={project.id} className="mb-16">
            <div className="flex gap-6 items-center">
              {project?.image?.src && (
                <div className="max-w-[100px]">
                  <Image
                    src={project?.image?.src}
                    className="rounded-3xl"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg md:text-xl uppercase">{project.name}</h3>
                <div className="mt-2">
                  <a
                    className="dark:text-blue-500 dark:hover:text-blue-600"
                    href={project.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {project.url}
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="italic">{project.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
