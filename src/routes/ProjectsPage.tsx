import { forwardRef, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  Layers,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProjects } from "@/hooks";
import { formatDateRange } from "@/lib/utils";
import { TProject } from "@/types/project";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useGetProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Dynamic project types from dataset
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    for (const p of projects) {
      if (p.type && p.type.trim()) {
        types.add(p.type.trim());
      }
    }
    return Array.from(types);
  }, [projects]);

  // Dynamic top technologies
  const allTechnologies = useMemo(() => {
    const techCounts = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.technologies || []) {
        techCounts.set(t.name, (techCounts.get(t.name) || 0) + 1);
      }
    }
    return Array.from(techCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Type filter
      if (selectedType === "featured" && !project.featured) {
        return false;
      }
      if (
        selectedType !== "all" &&
        selectedType !== "featured" &&
        project.type?.toLowerCase() !== selectedType.toLowerCase()
      ) {
        return false;
      }

      // Tech filter
      if (
        selectedTech &&
        !project.technologies?.some(
          (t) => t.name.toLowerCase() === selectedTech.toLowerCase(),
        )
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesDesc = (project.description || "")
          .toLowerCase()
          .includes(query);
        const matchesLongDesc = (project.longDescription || "")
          .toLowerCase()
          .includes(query);
        const matchesType = (project.type || "").toLowerCase().includes(query);
        const matchesTech = project.technologies?.some((t) =>
          t.name.toLowerCase().includes(query),
        );
        return (
          matchesName ||
          matchesDesc ||
          matchesLongDesc ||
          matchesType ||
          matchesTech
        );
      }

      return true;
    });
  }, [projects, selectedType, selectedTech, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedType !== "all" ||
    selectedTech !== null;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTech(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="craft-card w-full space-y-4 rounded-2xl p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <X className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Error loading projects
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Unable to retrieve the projects collection."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects & Engineering Work | Jorge de la Cruz</title>
        <meta
          name="description"
          content="Production web applications, client products, and frontend architecture systems engineered with React, TypeScript, Node.js, and Cloud Infrastructure."
        />
        <meta
          property="og:title"
          content="Projects & Engineering Work | Jorge de la Cruz"
        />
        <meta
          property="og:description"
          content="Production web applications, client products, and frontend architecture systems."
        />
      </Helmet>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-16">
        <div className="space-y-8 sm:space-y-10">
          {/* Header Section */}
          <header className="space-y-3 sm:space-y-4 border-b border-border/70 pb-6 sm:pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Selected Works // {projects.length} Projects</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Projects & Engineering Systems
            </h1>

            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Production web applications, full-stack client architectures, and
              high-performance tools engineered with modern TypeScript, React,
              Node.js, and scalable cloud workflows.
            </p>
          </header>

          {/* Interactive Search & Filter Controls */}
          <section
            aria-label="Project search and filters"
            className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-md"
          >
            {/* Search bar & Type filter row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, description, or stack..."
                  className="w-full rounded-xl border border-border/80 bg-background/80 py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {/* Type Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedType("all")}
                  className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-mono text-xs transition-all ${
                    selectedType === "all"
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  All ({projects.length})
                </button>

                {projects.some((p) => p.featured) ? (
                  <button
                    type="button"
                    onClick={() => setSelectedType("featured")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1.5 font-mono text-xs transition-all ${
                      selectedType === "featured"
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Featured</span>
                  </button>
                ) : null}

                {availableTypes.map((type) => {
                  const count = projects.filter(
                    (p) => p.type?.toLowerCase() === type.toLowerCase(),
                  ).length;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setSelectedType(selectedType === type ? "all" : type)
                      }
                      className={`rounded-lg px-2.5 sm:px-3 py-1.5 font-mono text-xs transition-all ${
                        selectedType.toLowerCase() === type.toLowerCase()
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {type} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technology tags row */}
            {allTechnologies.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3">
                <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground mr-1">
                  <Layers className="h-3 w-3" />
                  <span>Stack:</span>
                </span>
                {allTechnologies.map((tech) => {
                  const isSelected =
                    selectedTech?.toLowerCase() === tech.toLowerCase();
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setSelectedTech(isSelected ? null : tech)}
                      className={`craft-pill cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/15 text-primary font-semibold"
                          : ""
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}

                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                  >
                    <span>Reset filters</span>
                    <X className="h-3 w-3" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <strong className="font-semibold text-foreground">
                {filteredProjects.length}
              </strong>{" "}
              of {projects.length} projects
            </span>

            {selectedTech ? (
              <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] bg-secondary/80 px-2 py-0.5 rounded-md text-foreground">
                Filtered by technology: <strong>{selectedTech}</strong>
                <button
                  type="button"
                  onClick={() => setSelectedTech(null)}
                  className="hover:text-primary ml-0.5"
                  aria-label="Remove technology filter"
                >
                  ×
                </button>
              </span>
            ) : null}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="craft-card flex flex-col items-center justify-center rounded-2xl py-16 px-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No matching projects found
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                No projects matched your active search or filter criteria. Try
                broadening your keywords or resetting filters.
              </p>
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="mt-6 font-mono text-xs"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-5 sm:gap-6 md:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id || project.slug}
                    project={project}
                    onSelectTech={(tech) => setSelectedTech(tech)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}

interface ProjectCardProps {
  project: TProject;
  onSelectTech: (tech: string) => void;
}

const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(
  function ProjectCard({ project, onSelectTech }, ref) {
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
        ref={ref}
        layout
        variants={cardVariants}
        className="craft-card craft-card-interactive group flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all hover:border-primary/40"
      >
        <div className="space-y-4">
          {/* Top Header: Badge, Type & Date */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-secondary/90 font-mono text-[0.6875rem] font-medium tracking-wide text-foreground/90 border border-border/70"
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

          {/* Project Title & Hostname */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <span>{project.name}</span>
                  <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity text-primary" />
                </a>
              ) : (
                <span>{project.name}</span>
              )}
            </h2>

            {project.url ? (
              <span className="block font-mono text-xs text-muted-foreground/80">
                {formatHostname(project.url)}
              </span>
            ) : null}
          </div>

          {/* Project Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {displayDescription}
          </p>

          {project.longDescription &&
          project.longDescription !== displayDescription ? (
            <p className="text-xs font-mono leading-relaxed text-muted-foreground/90 border-l-2 border-primary/30 pl-3">
              {project.longDescription}
            </p>
          ) : null}

          {/* Technology Pills */}
          {project.technologies?.length ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => onSelectTech(tech.name)}
                  className="craft-pill cursor-pointer hover:border-primary/40 hover:text-primary transition-all text-[0.6875rem]"
                  title={`Filter by ${tech.name}`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Card Actions Footer */}
        {project.url || project.links?.github ? (
          <div className="mt-6 flex items-center gap-2.5 border-t border-border/50 pt-4">
            {project.url ? (
              <Button
                size="sm"
                className="flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all gap-1.5 shadow-sm"
                asChild
              >
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <span>Live demo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            ) : null}

            {project.links?.github ? (
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs px-3 text-muted-foreground hover:text-foreground hover:border-border transition-all gap-1.5"
                asChild
              >
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View source code"
                >
                  <FolderGit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Code</span>
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </motion.article>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

function formatHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
