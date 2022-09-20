import Link from "next/link";

export const HomeProjects = () => {
  return (
    <div className="my-8">
      <h3 className="text-xl md:text-2xl">
        <Link href="/projects">Projects</Link>
      </h3>
      <div className="my-2 md:my-4 px-4">
        <ul className="list-disc">
          <li>
            <a
              className="hover:text-blue-600"
              href="https://oportunidadesparatodos.pe"
              target="_blanck"
            >
              Oportunidades para todos
            </a>
          </li>
          <li>
            <a
              className="hover:text-blue-600"
              href="https://isee-glasses.com"
              target="_blanck"
            >
              Isee Glasses
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
