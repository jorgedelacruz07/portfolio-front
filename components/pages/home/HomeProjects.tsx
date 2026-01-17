import { FC, memo, useCallback } from "react";
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
import { SectionHeader } from "@/components/ui/SectionHeader";
import classNames from "classnames";
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
      className={classNames(
        "group transition-all duration-700 md:hover:shadow-2xl md:hover:scale-[1.04] border-border/30 md:hover:border-primary/50 bg-card/95 md:bg-card/70 md:backdrop-blur-md relative overflow-hidden will-change-transform",
        isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8",
      )}
      style={{
        animationDelay: `${index * 150}ms`,
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Enhanced gradient overlay - optimized for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/12 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Animated border effect - disabled on mobile */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/30 via-transparent to-primary/30 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 blur-sm hidden md:block"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
        <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary/15 rounded-full blur-lg"></div>
      </div>

      <CardHeader className="pb-5 relative z-10">
        <div className="flex items-start gap-4">
          {project.image?.src && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/60 transition-all duration-700 group-hover:scale-105 group-hover:rotate-1">
              <Image
                src={project.image.src}
                alt={project.name}
                width={64}
                height={64}
                sizes="(max-width: 768px) 64px, 64px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-700"></div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-700 mb-1">
              <Link
                href={`/projects/${project.slug}`}
                className="hover:underline decoration-primary/50 underline-offset-2"
              >
                {project.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground group-hover:text-primary/80 transition-colors duration-700">
              {project.type}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5 relative z-10">
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-700 line-clamp-3 text-sm">
          {project.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-0 relative z-10">
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, techIndex) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${techIndex * 30}ms` }}
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
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:shadow-md text-sm font-medium"
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
                <ExternalLinkIcon className="w-3.5 h-3.5 ml-1.5 group-hover:animate-bounce" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:shadow-md text-sm font-medium"
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
