import { forwardRef, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { useGetExperiences } from "@/hooks";
import { formatDateRange } from "@/lib/utils";
import { TExperience } from "@/types/experience";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

export default function ExperiencesPage() {
  const { data: experiences = [], isLoading, error } = useGetExperiences();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Dynamic top technologies across experiences
  const allTechnologies = useMemo(() => {
    const techCounts = new Map<string, number>();
    for (const e of experiences) {
      for (const t of e.technologies || []) {
        techCounts.set(t.name, (techCounts.get(t.name) || 0) + 1);
      }
    }
    return Array.from(techCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [experiences]);

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      // Tech filter
      if (
        selectedTech &&
        !experience.technologies?.some(
          (t) => t.name.toLowerCase() === selectedTech.toLowerCase(),
        )
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCompany = experience.company.toLowerCase().includes(query);
        const matchesTitle = experience.jobTitle.toLowerCase().includes(query);
        const matchesDesc = (experience.jobDescription || "")
          .toLowerCase()
          .includes(query);
        const matchesCompanyDesc = (experience.companyDescription || "")
          .toLowerCase()
          .includes(query);
        const matchesLocation = (experience.companyFrom || "")
          .toLowerCase()
          .includes(query);
        const matchesTech = experience.technologies?.some((t) =>
          t.name.toLowerCase().includes(query),
        );
        const matchesHighlights = experience.highlights?.some((h) =>
          h.toLowerCase().includes(query),
        );

        return (
          matchesCompany ||
          matchesTitle ||
          matchesDesc ||
          matchesCompanyDesc ||
          matchesLocation ||
          matchesTech ||
          matchesHighlights
        );
      }

      return true;
    });
  }, [experiences, selectedTech, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedTech !== null;

  const resetFilters = () => {
    setSearchQuery("");
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
            Error loading experiences
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Unable to retrieve professional experience history."}
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
        <title>
          Professional Experience & Career History | Jorge de la Cruz
        </title>
        <meta
          name="description"
          content="Track record across software engineering roles, team collaboration, system architecture, and product delivery."
        />
        <meta
          property="og:title"
          content="Professional Experience | Jorge de la Cruz"
        />
        <meta
          property="og:description"
          content="Track record of software engineering roles, team leadership, and product delivery."
        />
      </Helmet>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-16">
        <div className="space-y-8 sm:space-y-10">
          {/* Header Section */}
          <header className="space-y-3 sm:space-y-4 border-b border-border/70 pb-6 sm:pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Career Track Record // {experiences.length} Roles</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Professional Journey & Trajectory
            </h1>

            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              A comprehensive history of engineering positions, distributed
              collaborations, architectural milestones, and scalable web
              delivery.
            </p>
          </header>

          {/* Search & Filter Toolbar */}
          <section
            aria-label="Experience search and filters"
            className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-md"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company, role title, location, or stack..."
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

              {/* Status summary pill */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  Showing{" "}
                  <strong className="font-semibold text-foreground">
                    {filteredExperiences.length}
                  </strong>{" "}
                  of {experiences.length} roles
                </span>
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

          {/* Experiences List */}
          {filteredExperiences.length === 0 ? (
            <div className="craft-card flex flex-col items-center justify-center rounded-2xl py-16 px-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No matching career experiences
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                No roles matched your active search query or technology filter.
                Try adjusting your search terms.
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
              className="space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id || experience.slug}
                    experience={experience}
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

interface ExperienceCardProps {
  experience: TExperience;
  onSelectTech: (tech: string) => void;
}

const ExperienceCard = forwardRef<HTMLElement, ExperienceCardProps>(
  function ExperienceCard({ experience, onSelectTech }, ref) {
    return (
      <motion.article
        ref={ref}
        layout
        variants={cardVariants}
        className="craft-card craft-card-interactive group relative overflow-hidden rounded-2xl p-6 sm:p-7 space-y-5 transition-all hover:border-primary/40"
      >
        {/* Top Header Row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            {experience.image?.src ? (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
                <OptimizedImage
                  src={experience.image.src}
                  alt={experience.company}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                {experience.jobTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-foreground/90">
                  {experience.company}
                </span>
                {experience.companyFrom ? (
                  <>
                    <span className="text-border">•</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{experience.companyFrom}</span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Date Range Badge */}
          <div className="shrink-0">
            <span className="inline-flex items-center rounded-lg border border-border/70 bg-secondary/80 px-2.5 py-1 font-mono text-xs font-medium text-foreground/90">
              {formatDateRange(experience.from, experience.to)}
            </span>
          </div>
        </div>

        {/* Company Overview Subtitle */}
        {experience.companyDescription ? (
          <p className="text-xs font-mono text-muted-foreground/90 border-l-2 border-primary/40 pl-3">
            {experience.companyDescription}
          </p>
        ) : null}

        {/* Job Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {experience.jobDescription || "No role description provided."}
        </p>

        {/* Highlights / Key Accomplishments */}
        {experience.highlights?.length ? (
          <div className="space-y-2 pt-1">
            <h3 className="inline-flex items-center gap-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Key Responsibilities & Highlights</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {experience.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80 bg-card/60 border border-border/50 rounded-lg p-2.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Technology Pills & Action Links Footer */}
        <div className="flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {experience.technologies?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.map((tech) => (
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
          ) : (
            <div />
          )}

          {/* Action buttons */}
          {experience.companyUrl ? (
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs text-muted-foreground hover:text-foreground gap-1.5"
                asChild
              >
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Company website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </motion.article>
    );
  },
);
ExperienceCard.displayName = "ExperienceCard";
