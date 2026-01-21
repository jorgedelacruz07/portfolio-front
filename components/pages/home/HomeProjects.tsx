import { FC, memo } from "react";
import { TProject } from "../../../types/project";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks";
import { ProjectCard } from "@/components/cards/ProjectCard";

type Props = {
  projects: TProject[];
};

const HomeProjectsComponent: FC<Props> = ({ projects }) => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { refs, visibleItems } = useStaggeredAnimation(projects.length, 150);

  return (
    <div ref={sectionRef} className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float-reverse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Featured"
          highlight="Projects"
          viewAllHref="/projects"
          isVisible={isVisible}
          animated
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div key={project.slug} ref={(el) => (refs.current[index] = el)}>
              <ProjectCard
                project={project}
                index={index}
                isVisible={visibleItems.has(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

HomeProjectsComponent.displayName = "HomeProjects";
export const HomeProjects = memo(HomeProjectsComponent);
