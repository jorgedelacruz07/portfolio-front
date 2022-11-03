import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { TProject } from "../../../types/project";

type Props = {
  projects: TProject[];
};

export const HomeProjects: FC<Props> = ({ projects }) => {
  return (
    <div className="my-8 md:my-10">
      <h2 className="text-xl md:text-2xl font-semibold">
        <Link href="/projects">Projects</Link>
      </h2>
      <div className="pt-4 md:pt-6">
        <ul>
          {projects.map((project) => (
            <li key={project.slug} className="mb-4">
              <div className="flex items-center gap-4">
                <div className="max-w-[30px] md:max-w-[40px]">
                  <Image
                    src={project?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg"
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <Link href={`/projects#${project.slug}`}>
                    <a className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-400 text-sm md:text-base font-semibold">
                      {project.name}
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
