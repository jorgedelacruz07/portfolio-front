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
      <h1 className="text-2xl md:text-3xl text-center uppercase font-bold">
        Projects
      </h1>
      <div className="py-16">
        {projects.map((project) => (
          <div key={project.slug} id={project.slug} className="mb-16">
            <div className="flex gap-6 items-center">
              <div className="max-w-[70px] md:max-w-[80px] lg:max-w-[100px]">
                <Image
                  src={project?.image?.src || "/images/placeholder.jpg"}
                  className="rounded-2xl"
                  alt=""
                  width={120}
                  height={120}
                />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold uppercase">
                  {project.name}
                </h3>
                <div className="mt-2">
                  <a
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-600 dark:hover:text-blue-800 text-sm md:text-base"
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
              <div className="italic text-sm md:text-base">
                {project.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
