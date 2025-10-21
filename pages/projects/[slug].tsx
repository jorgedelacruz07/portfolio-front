import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { TProject } from "../../types/project";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  project: TProject;
};

const ProjectPage = ({ project }: Props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            {project.image?.src && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={project.image.src}
                  alt={project.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                {project.type && (
                  <span className="px-3 py-1 text-sm font-medium text-gray-100 bg-gray-700 dark:bg-gray-800 rounded-full">
                    {project.type}
                  </span>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time>
              {format(new Date(project.from), "MMMM yyyy")} -{" "}
              {project.to
                ? format(new Date(project.to), "MMMM yyyy")
                : "Present"}
            </time>
          </div>
        </header>

        {/* Project Image */}
        {project.image?.src && (
          <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={project.image.src}
              alt={project.name}
              width={800}
              height={450}
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Description */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
            <Link href="/projects">
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Projects
              </>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let project = null;

  const url = process.env.NEXT_PUBLIC_API_URL;
  const slug = params?.slug;

  try {
    project = await axios
      .get(`${url}/client/projects/${slug}`)
      .then((res) => res.data);
  } catch (error) {
    console.error('[Project slug getStaticProps] Failed to fetch project:', {
      slug,
      message: error instanceof Error ? error.message : 'Unknown error',
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      statusText: axios.isAxiosError(error) ? error.response?.statusText : undefined,
      url: axios.isAxiosError(error) ? error.config?.url : undefined,
    });
  }

  return {
    props: {
      project,
    },
    revalidate: 60,
  };
};

export default ProjectPage;
