import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { Button } from "@/components/ui/button";
import { useGetExperienceBySlug } from "@/hooks";
import { formatDateRange } from "@/lib/utils";

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: experience, isLoading, error } = useGetExperienceBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {error instanceof Error
              ? "Error loading experience"
              : "Experience not found"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The requested experience could not be found."}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/experiences">Back to Experiences</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${experience.jobTitle} | Jorge de la Cruz`}</title>
        <meta
          name="description"
          content={
            experience.jobDescription ||
            `${experience.jobTitle} at ${experience.company}`
          }
        />
        <meta
          property="og:title"
          content={`${experience.jobTitle} at ${experience.company} | Jorge de la Cruz`}
        />
        <meta
          property="og:description"
          content={experience.jobDescription || "Work experience details"}
        />
        {experience.image?.src && (
          <meta property="og:image" content={experience.image.src} />
        )}
        <meta
          name="twitter:title"
          content={`${experience.jobTitle} at ${experience.company} | Jorge de la Cruz`}
        />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-8">
          {/* Back link */}
          <Link
            to="/experiences"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>←</span>
            <span>All experience</span>
          </Link>

          {/* Header */}
          <header className="space-y-4 border-b border-border/80 pb-6">
            <div className="flex items-start gap-4">
              {experience.image?.src ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-subtle">
                  <OptimizedImage
                    src={experience.image.src}
                    alt={experience.company}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1 space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {experience.jobTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="text-lg font-medium text-foreground/85">
                    {experience.company}
                  </span>
                  <span className="text-border">•</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDateRange(experience.from, experience.to)}
                  </span>
                </div>
              </div>

              {experience.companyUrl ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs shrink-0"
                  asChild
                >
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span>Website</span>
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </header>

          {/* Role Details */}
          <div className="craft-card rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Role & Responsibilities
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {experience.jobDescription}
            </p>
          </div>

          {experience.companyDescription ? (
            <div className="craft-card rounded-xl p-6 sm:p-8 space-y-3">
              <h2 className="text-base font-semibold text-foreground">
                About {experience.company}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {experience.companyDescription}
              </p>
            </div>
          ) : null}

          {/* Technologies */}
          {experience.technologies?.length ? (
            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <span key={tech.id} className="craft-pill text-xs">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
