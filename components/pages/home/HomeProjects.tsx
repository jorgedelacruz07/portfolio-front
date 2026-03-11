import Image from "next/image";
import Link from "next/link";
import { TProject } from "@/types/project";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, homePageStyles } from "@/lib/utils";

type HomeProjectsProps = {
  projects: TProject[];
};

type ProjectShowcaseCardProps = {
  project: TProject;
};

const ProjectTechnologyList = ({
  technologies,
}: Pick<TProject, "technologies">) => {
  return (
    <div className={homePageStyles.metaList}>
      {technologies.slice(0, 4).map((technology) => (
        <Badge
          key={technology.id}
          variant="secondary"
          className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground"
        >
          {technology.name}
        </Badge>
      ))}
    </div>
  );
};

const ProjectActions = ({ project }: ProjectShowcaseCardProps) => {
  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row">
      <Button
        asChild
        variant="outline"
        className="h-11 flex-1 rounded-full border-border bg-background/80 px-5 text-sm font-semibold"
      >
        <Link href={`/projects/${project.slug}`}>Read case study</Link>
      </Button>

      {project.url ? (
        <Button
          asChild
          className="h-11 flex-1 rounded-full px-5 text-sm font-semibold"
        >
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

const ProjectShowcaseCard = ({ project }: ProjectShowcaseCardProps) => {
  return (
    <article className={cn(homePageStyles.spotlightCard, "group")}>
      <div className="flex items-start gap-4">
        {project.image?.src ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={project.image.src}
              alt={project.name}
              width={64}
              height={64}
              sizes="64px"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {project.type}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-primary"
            >
              {project.name}
            </Link>
          </h3>
        </div>
      </div>

      <p className="text-sm leading-7 text-muted-foreground">
        {project.description}
      </p>

      <ProjectTechnologyList technologies={project.technologies} />
      <ProjectActions project={project} />
    </article>
  );
};

export const HomeProjects = ({ projects }: HomeProjectsProps) => {
  return (
    <HomeSection
      eyebrow="Selected work"
      title="Projects with strong UX foundations and maintainable architecture."
      description="A curated set of recent work focused on component systems, frontend performance, and product delivery quality."
      actionHref="/projects"
      actionLabel="All projects"
      contentClassName="space-y-6"
    >
      <div className={homePageStyles.featuredGrid}>
        {projects.map((project) => (
          <ProjectShowcaseCard key={project.slug} project={project} />
        ))}
      </div>
    </HomeSection>
  );
};
