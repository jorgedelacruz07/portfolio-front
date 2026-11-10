import { TProject } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HomeSection } from "@/components/pages/home/HomeSection";

type HomeProjectsProps = {
  projects: TProject[];
};

export const HomeProjects = ({ projects }: HomeProjectsProps) => {
  const [featured, ...rest] = projects;

  return (
    <HomeSection
      index="01"
      eyebrow="Selected work"
      title="Products I’ve shipped"
      description="Side projects and products shaped around real problems — built end-to-end, from the data model to the interface."
      actionHref="/projects"
      actionLabel="All projects"
    >
      <div className="space-y-2 sm:space-y-5">
        {featured ? (
          <ProjectCard project={featured} heading="h3" spotlight index={1} />
        ) : null}
        {rest.length > 0 ? (
          <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
            {rest.map((project, index) => (
              <ProjectCard
                key={project.id || project.slug}
                project={project}
                heading="h3"
                index={index + 2}
              />
            ))}
          </div>
        ) : null}
      </div>
    </HomeSection>
  );
};
