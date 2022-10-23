import Link from "next/link";
import { FC } from "react";
import { TProject } from "../../../types/project";

type Props = {
  projects: TProject[];
};

export const HomeProjects: FC<Props> = ({ projects }) => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">
        <Link href="/projects">Projects</Link>
      </h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          {projects.map((project) => (
            <li key={project.id}>
              <a
                className="hover:text-blue-600"
                href="https://oportunidadesparatodos.pe"
                target="_blanck"
              >
                Oportunidades para todos
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
