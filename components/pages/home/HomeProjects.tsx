import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TProject } from "@/types/project";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { homeMotion } from "@/lib/utils";

type HomeProjectsProps = {
  projects: TProject[];
};

const ProjectShowcaseCard = ({ project }: { project: TProject }) => {
  return (
    <motion.article
      variants={homeMotion.item}
      className="craft-card craft-card-interactive flex flex-col justify-between overflow-hidden rounded-xl p-5"
    >
      <div className="space-y-4">
        {/* Project Image Preview */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/80 bg-muted">
          {project.image?.src ? (
            <OptimizedImage
              src={project.image.src}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={800}
              height={450}
            />
          ) : null}
          <div className="absolute right-2.5 top-2.5">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-md"
            >
              {project.type || "Web App"}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary">
            <Link to={`/projects/${project.slug}`}>{project.name}</Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech.id} className="craft-pill">
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 ? (
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              +{project.technologies.length - 4}
            </span>
          ) : null}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 font-mono text-xs"
        >
          <Link to={`/projects/${project.slug}`}>Case study</Link>
        </Button>
        {project.url ? (
          <Button asChild size="sm" className="flex-1 font-mono text-xs">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5"
            >
              <span>Live demo</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
};

export const HomeProjects = ({ projects }: HomeProjectsProps) => {
  return (
    <HomeSection
      eyebrow="Selected Work"
      title="Featured applications & systems"
      description="Production products showcasing frontend architecture, performant APIs, and clean UX execution."
      actionHref="/projects"
      actionLabel="All projects"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectShowcaseCard key={project.slug} project={project} />
        ))}
      </div>
    </HomeSection>
  );
};
