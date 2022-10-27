import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { TProject } from "../../../types/project";

type Props = {
  projects: TProject[];
};

export const HomeProjects: FC<Props> = ({ projects }) => {
  return (
    <div className="my-4 md:my-8">
      <h3 className="text-xl md:text-2xl">
        <Link href="/projects">Projects</Link>
      </h3>
      <div className="py-4 md:py-6">
        <ul>
          {projects.map((project) => (
            <li key={project.slug}>
              <div className="flex gap-4 items-center">
                <div className="max-w-[40px] md:max-w-[50px]">
                  <Image
                    src={project?.image?.src || "/images/placeholder.jpg"}
                    className="rounded-lg"
                    alt=""
                    width={180}
                    height={180}
                  />
                </div>
                <div>
                  <Link href={`/projects#${project.slug}`}>
                    <a className="text-sm md:text-base">{project.name}</a>
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
