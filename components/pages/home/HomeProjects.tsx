import { TProject } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HomeSection } from "@/components/pages/home/HomeSection";

type HomeProjectsProps = {
  projects: TProject[];
};

export const HomeProjects = ({ projects }: HomeProjectsProps) => {
  return (
    <HomeSection
      eyebrow="Selected work"
      title="Featured applications"
      description="Selected products and tools spanning personal finance, education, and developer workflows."
      actionHref="/projects"
      actionLabel="All projects"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id || project.slug}
            project={project}
            heading="h3"
          />
        ))}
      </div>
    </HomeSection>
  );
};
