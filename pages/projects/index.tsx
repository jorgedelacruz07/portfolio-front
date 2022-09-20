import type { NextPage } from "next";
import { projects } from "../../data/content";

const Projects: NextPage = () => {
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
