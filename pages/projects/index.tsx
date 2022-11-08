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
    revalidate: 60,
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
      <div className="py-12 md:py-16">
        {projects.map((project) => (
          <div key={project.slug} id={project.slug} className="mb-12 md:mb-16">
            <div className="flex items-center gap-6">
              <div className="max-w-[70px] md:max-w-[80px] 3xl:max-w-[90px]">
                <Image
                  src={project?.image?.src || "/images/placeholder.jpg"}
                  className="rounded-2xl"
                  alt=""
                  width={90}
                  height={90}
                />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-semibold uppercase">
                  {project.name}
                </h3>
                {project.type && (
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs md:text-sm uppercase font-semibold text-black dark:text-white bg-blue-200 dark:bg-blue-900 rounded-md">
                      {project.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base italic">
                {project.description}
              </div>
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
              <div className="mt-4">
                <span className="text-xs md:text-sm font-semibold">
                  Stack:{" "}
                </span>
                {project?.technologies?.map((technology) => (
                  <span
                    key={technology.id}
                    className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs md:text-sm font-semibold leading-none text-black dark:text-white bg-slate-300 dark:bg-slate-700 rounded-full"
                  >
                    {technology.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
