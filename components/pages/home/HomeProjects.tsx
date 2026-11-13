import { TProject } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HomeSection } from "@/components/pages/home/HomeSection";
import type { TSiteCopy } from "@/lib/site-copy";

type HomeProjectsProps = {
  projects: TProject[];
  copy: TSiteCopy;
};

export const HomeProjects = ({ projects, copy }: HomeProjectsProps) => {
  const [featured, ...rest] = projects;

  return (
    <HomeSection
      index="01"
      eyebrow={copy["home.projects.eyebrow"]}
      title={copy["home.projects.title"]}
      description={copy["home.projects.description"]}
      actionHref="/projects"
      actionLabel={copy["home.projects.action"]}
    >
      <div className="space-y-2 sm:space-y-5">
        {featured ? <ProjectCard project={featured} heading="h3" spotlight index={1} /> : null}
        {rest.length > 0 ? (
          <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
            {rest.map((project, index) => (
              <ProjectCard key={project.id || project.slug} project={project} heading="h3" index={index + 2} />
            ))}
          </div>
        ) : null}
      </div>
    </HomeSection>
  );
};
