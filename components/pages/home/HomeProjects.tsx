import { FC, memo, useMemo, useCallback } from "react";
import { TProject } from "../../../types/project";
import Link from "next/link";
import Image from "next/image";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";

type Props = {
  projects: TProject[];
};

// Memoized project card component
const ProjectCard = memo<{ project: TProject }>(({ project }) => {
  const handleExternalLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="group">
      <div className="h-full relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {project.image?.src && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={project.image.src}
                  alt={project.name}
                  width={48}
                  height={48}
                  sizes="(max-width: 768px) 48px, 48px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="text-lg font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-300">
              <Link href={`/projects/${project.slug}`}>
                {project.name}
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {project.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 font-semibold">
              <span>{project.type}</span>
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
              onClick={handleExternalLinkClick}
              className="inline-flex items-center text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold"
            >
              Visit Project
              <ExternalLinkIcon className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const HomeProjectsComponent: FC<Props> = ({ projects }) => {
  // Memoize the sliced projects to prevent unnecessary re-renders
  const featuredProjects = useMemo(() => projects.slice(0, 3), [projects]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Featured Projects
        </h2>
        <div className="text-cyan-800 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-gray-100 transition-colors duration-300 font-semibold">
          <Link href="/projects">View All</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
};

HomeProjectsComponent.displayName = 'HomeProjects';
export const HomeProjects = memo(HomeProjectsComponent);
