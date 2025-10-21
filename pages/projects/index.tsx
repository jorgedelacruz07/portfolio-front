import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useGetProjects } from "../../hooks/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const Projects: NextPage = () => {
  const { data: projects = [], isLoading, error } = useGetProjects();

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-cyan-600 hover:text-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          My Projects
        </h1>
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No projects available at the moment.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.slug} className="group">
                <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {project.image?.src && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={project.image.src}
                            alt={project.name || 'Project'}
                            width={48}
                            height={48}
                            className="object-cover"
                            sizes="48px"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="text-lg md:text-xl font-semibold text-black dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                        <Link href={`/projects/${project.slug}`}>
                          {project.name || 'Untitled Project'}
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 font-semibold">
                        <span>{project.type || 'Unknown type'}</span>
                      </div>
                    </div>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech.id}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
                      >
                        Visit Project
                        <svg
                          className="w-4 h-4 ml-1"
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
