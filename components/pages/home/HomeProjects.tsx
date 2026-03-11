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
};

const ProjectShowcaseCard = ({ project }: ProjectShowcaseCardProps) => {
  return (
    <motion.article
      variants={homeMotion.item}
      className={cn(homePageStyles.spotlightCard, "h-full")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-20 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/25 aspect-[16/10]">
        {project.image?.src ? (
          <OptimizedImage
            src={project.image.src}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            width={960}
            height={640}
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <Badge variant="secondary" className="px-2 py-0.5 text-[0.62rem]">
            {project.type}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
            <Link
              to={`/projects/${project.slug}`}
              className="transition-colors hover:text-primary"
            >
              {project.name}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((technology) => (
            <Badge
              key={technology.id}
              variant="secondary"
              className="px-2 py-0.5 text-[0.62rem]"
            >
              {technology.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <Button
          asChild
          variant="outline"
          className="h-9 px-3.5 text-sm font-semibold"
        >
          <Link to={`/projects/${project.slug}`}>Case study</Link>
        </Button>

        {project.url ? (
          <Button asChild className="h-9 px-3.5 text-sm font-semibold">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              Live
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
      eyebrow="Selected work"
      title={
        <>
          Products built across
          <span className="text-premium-gradient">
            {" "}
            app, API, and AI layers.
          </span>
        </>
      }
      description="Selected work spanning React apps, backend systems, and AI-assisted product delivery."
      actionHref="/projects"
      actionLabel="All projects"
    >
      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectShowcaseCard key={project.slug} project={project} />
        ))}
      </div>
    </HomeSection>
  );
};
