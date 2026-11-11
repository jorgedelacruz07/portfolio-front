import { useMemo, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Search, X } from "lucide-react";

import { PageSkeleton } from "@/components/PageSkeleton";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import { SearchField } from "@/components/ui/search-field";
import { useGetProjects } from "@/hooks";
import { orderPublicProjects } from "@/lib/project-order";
import { listView } from "@/lib/list-state";
import { cn } from "@/lib/utils";

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useGetProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    for (const project of projects) {
      if (project.type && project.type.trim()) {
        types.add(project.type.trim());
      }
    }
    return Array.from(types);
  }, [projects]);

  const allTechnologies = useMemo(() => {
    const techCounts = new Map<string, number>();
    for (const project of projects) {
      for (const technology of project.technologies || []) {
        techCounts.set(technology.name, (techCounts.get(technology.name) || 0) + 1);
      }
    }
    return Array.from(techCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return orderPublicProjects(projects).filter((project) => {
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

      if (
        selectedTech &&
        !project.technologies?.some((tech) => tech.name.toLowerCase() === selectedTech.toLowerCase())
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesDesc = (project.description || "").toLowerCase().includes(query);
        const matchesLongDesc = (project.longDescription || "").toLowerCase().includes(query);
        const matchesType = (project.type || "").toLowerCase().includes(query);
        const matchesTech = project.technologies?.some((tech) => tech.name.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesLongDesc || matchesType || matchesTech;
      }

      return true;
    });
  }, [projects, selectedType, selectedTech, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedType !== "all" || selectedTech !== null;
  const showGroups = !hasActiveFilters;
  const featuredProjects = showGroups ? filteredProjects.filter((project) => project.featured) : [];
  const earlierProjects = showGroups ? filteredProjects.filter((project) => !project.featured) : filteredProjects;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedTech(null);
  };

  if (isLoading) {
    return <PageSkeleton variant="listing" />;
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          heading="h1"
          icon={<X className="h-5 w-5" />}
          title="Error loading projects"
          description={error instanceof Error ? error.message : "Unable to retrieve the projects collection."}
        >
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Try again
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects & Engineering Work | Jorge de la Cruz Padilla</title>
        <meta
          name="description"
          content="Selected products, personal tools, and client work built with TypeScript, React, Node.js, and other stacks."
        />
        <meta property="og:title" content="Projects & Engineering Work | Jorge de la Cruz Padilla" />
        <meta property="og:description" content="Selected products, personal tools, and client work." />
      </Helmet>

      <PageContainer className="space-y-10">
        <PageHeader
          eyebrow={`${projects.length} projects`}
          title="Projects & Engineering Systems"
          description="Products, personal tools, and client work across finance, education, and other domains. Explore each project's stack, design decisions, and availability."
        />

        <section aria-label="Project search and filters" className="space-y-4">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search projects"
            placeholder="Search by title, description, or stack..."
          />
          <div className="flex flex-wrap items-center gap-1">
            <FilterButton active={selectedType === "all"} onClick={() => setSelectedType("all")}>
              All ({projects.length})
            </FilterButton>
            {projects.some((project) => project.featured) ? (
              <FilterButton active={selectedType === "featured"} onClick={() => setSelectedType("featured")}>
                Featured
              </FilterButton>
            ) : null}
            {availableTypes.map((type) => {
              const count = projects.filter((project) => project.type?.toLowerCase() === type.toLowerCase()).length;
              return (
                <FilterButton
                  key={type}
                  active={selectedType.toLowerCase() === type.toLowerCase()}
                  onClick={() => setSelectedType(selectedType === type ? "all" : type)}
                >
                  {type} ({count})
                </FilterButton>
              );
            })}
          </div>
          {allTechnologies.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm text-muted-foreground">Stack</span>
              {allTechnologies.map((tech) => {
                const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={tech}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTech(isSelected ? null : tech)}
                    className={badgeVariants({
                      variant: isSelected ? "default" : "secondary",
                    })}
                  >
                    {tech}
                  </button>
                );
              })}
              {hasActiveFilters ? (
                <button type="button" onClick={resetFilters} className="ml-auto text-sm text-primary hover:underline">
                  Reset filters
                </button>
              ) : null}
            </div>
          ) : null}
        </section>

        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredProjects.length}</span> of {projects.length}{" "}
          projects
          {selectedTech ? <span> · {selectedTech}</span> : null}
        </p>

        {listView(projects.length, filteredProjects.length) === "empty" ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No projects yet"
            description="Published projects will show up here."
          />
        ) : listView(projects.length, filteredProjects.length) === "no-results" ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No matching projects found"
            description="No projects matched your active search or filter criteria. Try broadening your keywords or resetting filters."
          >
            <Button onClick={resetFilters} variant="outline" size="sm">
              Clear all filters
            </Button>
          </EmptyState>
        ) : showGroups ? (
          <div className="space-y-12">
            {featuredProjects.length > 0 ? (
              <section className="space-y-4" aria-labelledby="featured-projects">
                <h2 id="featured-projects" className="text-lg font-semibold tracking-tight text-foreground">
                  Featured
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {featuredProjects.map((project) => (
                    <ProjectCard
                      key={project.id || project.slug}
                      project={project}
                      heading="h3"
                      onSelectTech={setSelectedTech}
                    />
                  ))}
                </div>
              </section>
            ) : null}
            {earlierProjects.length > 0 ? (
              <section className="space-y-4" aria-labelledby="earlier-projects">
                <h2 id="earlier-projects" className="text-lg font-semibold tracking-tight text-foreground">
                  Earlier work
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {earlierProjects.map((project) => (
                    <ProjectCard
                      key={project.id || project.slug}
                      project={project}
                      heading="h3"
                      onSelectTech={setSelectedTech}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} onSelectTech={setSelectedTech} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
