import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TProject } from "@/types/project";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, homeMotion, homePageStyles } from "@/lib/utils";

type HomeProjectsProps = {
  projects: TProject[];
};

type ProjectShowcaseCardProps = {
  project: TProject;
  index: number;
};

const getProjectCardLayout = (index: number) => {
  if (index === 0) {
    return "lg:col-span-7 lg:row-span-2";
  }

  if (index === 1 || index === 2) {
    return "lg:col-span-5";
  }

  return "lg:col-span-6";
};

const ProjectTechnologyList = ({
  technologies,
}: Pick<TProject, "technologies">) => {
  return (
    <div className={homePageStyles.metaList}>
      {technologies.slice(0, 4).map((technology) => (
        <Badge key={technology.id} variant="secondary">
          {technology.name}
        </Badge>
      ))}
    </div>
  );
};

const ProjectActions = ({ project }: Pick<TProject, "slug" | "url">) => {
  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
      <Button
        asChild
        variant="outline"
        className="h-11 flex-1 text-sm font-semibold"
      >
        <Link to={`/projects/${project.slug}`}>Read case study</Link>
      </Button>

      {project.url ? (
        <Button asChild className="h-11 flex-1 text-sm font-semibold">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
          >
            Live preview
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </Button>
      ) : null}
    </div>
  );
};

const ProjectShowcaseCard = ({ project, index }: ProjectShowcaseCardProps) => {
  const isFeatured = index === 0;

  return (
    <motion.article
      variants={homeMotion.item}
      className={cn(homePageStyles.spotlightCard, getProjectCardLayout(index))}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-12 top-0 h-24 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25",
          isFeatured ? "aspect-[16/10]" : "aspect-[16/11]",
        )}
      >
        {project.image?.src ? (
          <OptimizedImage
            src={project.image.src}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            width={960}
            height={640}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
          <Badge variant="secondary">{project.type}</Badge>
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            Featured build
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary/80">
            Product delivery
          </p>
          <h3
            className={cn(
              "font-semibold tracking-[-0.05em] text-foreground",
              isFeatured ? "text-3xl sm:text-4xl" : "text-2xl",
            )}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="transition-colors hover:text-primary"
            >
              {project.name}
            </Link>
          </h3>
        </div>

        <p
          className={cn(
            "text-sm leading-7 text-muted-foreground",
            isFeatured ? "max-w-2xl sm:text-base sm:leading-8" : "line-clamp-3",
          )}
        >
          {project.description}
        </p>
      </div>

      <ProjectTechnologyList technologies={project.technologies} />
      <ProjectActions project={project} />
    </motion.article>
  );
};

export const HomeProjects = ({ projects }: HomeProjectsProps) => {
  return (
    <HomeSection
      eyebrow="Selected work"
      title={
        <>
          Projects with
          <span className="text-premium-gradient"> strong UX foundations </span>
          and maintainable architecture.
        </>
      }
      description="A curated set of recent work focused on component systems, frontend performance, and product delivery quality."
      actionHref="/projects"
      actionLabel="All projects"
      contentClassName="space-y-6"
    >
      <div className={homePageStyles.featuredGrid}>
        {projects.map((project, index) => (
          <ProjectShowcaseCard
            key={project.slug}
            project={project}
            index={index}
          />
        ))}
      </div>
    </HomeSection>
  );
};
