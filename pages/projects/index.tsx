import type { NextPage } from "next";

const Projects: NextPage = () => {
  const projects = [
    {
      id: 1,
      slug: "oportunidades-para-todos",
      name: "Oportunidades para todos",
      url: "https://oportunidadesparatodos.pe",
      description:
        "'Oportunidades para todos' fue un proyecto hecho con Next.js por el lado del frontend, con Express.js por el lado del backend y usamos MongoDB a nivel de base de datos.",
    },
    {
      id: 2,
      slug: "isee-glasses",
      name: "Isee Glasses",
      url: "https://isee-glasses.com",
      description:
        "'Isee Glasses' fue un proyecto hecho con PHP y el framework Laravel y usamos MySQL a nivel de base de datos.",
    },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-3xl text-center uppercase">Projects</h1>
      <div>
        {projects.map((project) => (
          <div key={project.id} className="my-16">
            <h3 className="md:text-2xl uppercase">{project.name}</h3>
            <div className="my-6">
              <div className="my-2">
                <label htmlFor="">Link: </label>
                <a className="hover:text-blue-600" href={project.url} rel="">
                  {project.url}
                </a>
              </div>
              <div className="my-2">
                <span>Description: </span>
                <span>{project.description}</span>
              </div>
              <div className="my-2">
                <iframe className="w-full h-96" src={project.url}></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
