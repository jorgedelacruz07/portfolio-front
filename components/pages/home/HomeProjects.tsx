import { FC, memo, useMemo, useCallback } from "react";
import { TProject } from "../../../types/project";
import Link from "next/link";
import Image from "next/image";
import { ExternalLinkIcon } from "../../icons/ExternalLinkIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks";

type Props = {
  projects: TProject[];
};

// Memoized project card component
const ProjectCard = memo<{
  project: TProject;
  index: number;
  isVisible: boolean;
}>(({ project, index, isVisible }) => {
  const handleExternalLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card
      className={cn(
        "group transition-all duration-500 hover:shadow-xl hover:scale-[1.03] border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover-lift",
        isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8",
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {project.image?.src && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-300">
              <Image
                src={project.image.src}
                alt={project.name}
                width={64}
                height={64}
                sizes="(max-width: 768px) 64px, 64px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors duration-300 hover-glow">
              <Link href={`/projects/${project.slug}`} className="hover-scale">
                {project.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-base font-medium text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
              {project.type}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {project.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-0">
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, techIndex) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-scale"
                style={{ animationDelay: `${techIndex * 50}ms` }}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {project.url && (
            <Button
              variant="default"
              size="sm"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover-glow"
              onClick={handleExternalLinkClick}
              asChild
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                View Project
                <ExternalLinkIcon className="w-4 h-4 ml-2 group-hover:animate-bounce" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full hover-scale"
            asChild
          >
            <Link href={`/projects/${project.slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";

const HomeProjectsComponent: FC<Props> = ({ projects }) => {
  // Memoize the sliced projects to prevent unnecessary re-renders
  const featuredProjects = useMemo(() => projects.slice(0, 3), [projects]);

  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { refs, visibleItems } = useStaggeredAnimation(
    featuredProjects.length,
    150,
  );

  return (
    <div ref={sectionRef} className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float-reverse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={cn(
            "flex items-center justify-between mb-12 transition-all duration-1000",
            isVisible
              ? "animate-fade-in-down"
              : "opacity-0 translate-y-[-30px]",
          )}
        >
          <div className="flex items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured{" "}
              <span className="text-primary gradient-text animate-gradient">
                Projects
              </span>
            </h2>
            <div className="ml-4 h-1 w-16 bg-primary animate-glow"></div>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-semibold hover-scale"
            asChild
          >
            <Link href="/projects">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
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
