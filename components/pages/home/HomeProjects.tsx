import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, FolderGit2, Sparkles } from "lucide-react";

import { TProject } from "@/types/project";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateRange, homeMotion } from "@/lib/utils";

type HomeProjectsProps = {
  projects: TProject[];
};

const ProjectShowcaseCard = ({ project }: { project: TProject }) => {
  // Use longDescription if description is too short or identical to name
  const displayDescription =
    project.description &&
    project.description.trim().toLowerCase() !==
      project.name.trim().toLowerCase()
      ? project.description
      : project.longDescription ||
        project.description ||
        "Production web application and system architecture.";

  return (
    <motion.article
      variants={homeMotion.item}
      className="craft-card craft-card-interactive group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6 transition-all hover:border-primary/40"
    >
      <div className="space-y-3">
        {/* Top Meta Header: Type Badge, Featured, and Date Range */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-secondary/90 px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium tracking-wide text-foreground/90 border border-border/70"
            >
              {project.type || "Web App"}
            </Badge>

            {project.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[0.6875rem] font-semibold text-primary border border-primary/20">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Featured</span>
              </span>
            ) : null}
          </div>

          {project.from ? (
            <span className="font-mono text-[0.6875rem] text-muted-foreground">
              {formatDateRange(project.from, project.to)}
            </span>
          ) : null}
        </div>

        {/* Project Title & External Link */}
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <span>{project.name}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100 text-primary" />
              </a>
            ) : (
              <span>{project.name}</span>
            )}
          </h3>

          {project.url ? (
            <span className="block font-mono text-[0.6875rem] text-muted-foreground/80">
              {formatHostname(project.url)}
            </span>
          ) : null}
        </div>

        {/* Project Description */}
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {displayDescription}
        </p>

        {/* Tech Badges */}
        {project.technologies?.length ? (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech.id} className="craft-pill text-[0.6875rem]">
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 5 ? (
              <span className="self-center font-mono text-[0.6875rem] text-muted-foreground">
                +{project.technologies.length - 5} more
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3.5">
        {project.url ? (
          <Button
            asChild
            size="sm"
            className="flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-sm transition-all h-8"
          >
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <span>Live demo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 font-mono text-xs hover:border-primary/40 hover:text-primary transition-all h-8"
          >
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-1.5"
            >
              <span>View in projects</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        )}

        {project.links?.github ? (
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs px-2.5 text-muted-foreground hover:text-foreground hover:border-border transition-all gap-1.5 h-8"
            asChild
          >
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              title="View source code"
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Code</span>
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
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectShowcaseCard
            key={project.id || project.slug}
            project={project}
          />
        ))}
      </div>
    </HomeSection>
  );
};

function formatHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
