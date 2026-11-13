import { type ReactNode, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";

import { HomeAbout } from "@/components/pages/home/HomeAbout";
import { HomeProfile } from "@/components/pages/home/HomeProfile";
import { HomeSection } from "@/components/pages/home/HomeSection";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page";
import { useDeferredRender, useHomePageData, useSiteContent } from "@/hooks";
import { careerSnapshot } from "@/lib/experience-groups";
import { cn } from "@/lib/utils";
import type { TSiteCopy } from "@/lib/site-copy";

const HomeProjects = lazy(() =>
  import("@/components/pages/home/HomeProjects").then((module) => ({
    default: module.HomeProjects,
  })),
);

const HomeExperiences = lazy(() =>
  import("@/components/pages/home/HomeExperiences").then((module) => ({
    default: module.HomeExperiences,
  })),
);

const HomeGithub = lazy(() =>
  import("@/components/pages/home/HomeGithub").then((module) => ({
    default: module.HomeGithub,
  })),
);

type DeferredSectionProps = {
  children: ReactNode;
  className?: string;
};

function DeferredSectionPlaceholder() {
  return (
    <section className="space-y-6" aria-hidden="true">
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="h-3 w-32 motion-safe:animate-pulse rounded-full bg-muted/70" />
        <div className="h-8 w-3/4 max-w-md motion-safe:animate-pulse rounded-lg bg-muted/70" />
        <div className="h-4 w-full max-w-xl motion-safe:animate-pulse rounded-lg bg-muted/60" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="space-y-4 rounded-2xl border border-border/80 bg-card p-2">
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 motion-safe:animate-pulse rounded-lg bg-muted/70" />
              <div className="space-y-2">
                <div className="h-3 w-full motion-safe:animate-pulse rounded-lg bg-muted/60" />
                <div className="h-3 w-5/6 motion-safe:animate-pulse rounded-lg bg-muted/60" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-14 motion-safe:animate-pulse rounded-full bg-muted/60" />
                <div className="h-5 w-16 motion-safe:animate-pulse rounded-full bg-muted/60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeferredSection({ children, className }: DeferredSectionProps) {
  const { ref, shouldRender } = useDeferredRender();

  return (
    <div ref={ref} className={cn("min-h-0", className)}>
      {shouldRender ? children : <DeferredSectionPlaceholder />}
    </div>
  );
}

/** The GitHub block is optional: it reserves no space and only fetches once it is near the viewport. */
function DeferredGithub({ copy }: { copy: TSiteCopy }) {
  const { ref, shouldRender } = useDeferredRender();

  return (
    <div ref={ref}>
      {shouldRender ? (
        <Suspense fallback={null}>
          <HomeGithub copy={copy} />
        </Suspense>
      ) : null}
    </div>
  );
}

function SectionLoadError({
  eyebrow,
  title,
  index,
  onRetry,
  pending,
  description,
  retryLabel,
  retryPendingLabel,
}: {
  eyebrow: string;
  title: string;
  index: string;
  onRetry: () => void;
  pending: boolean;
  description: string;
  retryLabel: string;
  retryPendingLabel: string;
}) {
  return (
    <HomeSection index={index} eyebrow={eyebrow} title={title} description={description}>
      <Button type="button" variant="outline" onClick={onRetry} disabled={pending}>
        {pending ? retryPendingLabel : retryLabel}
      </Button>
    </HomeSection>
  );
}

export default function HomePage() {
  const { profile, skills, experiences, projects, isLoading, error, isFetching, refetch } = useHomePageData();
  const { copy, settings } = useSiteContent();
  const snapshot = careerSnapshot(experiences);
  const retry = () => {
    void refetch();
  };

  return (
    <>
      <Helmet>
        <title>{settings?.seoTitle || copy["layout.siteName"]}</title>
        <meta name="description" content={settings?.seoDescription || ""} />
      </Helmet>

      <PageContainer className="flex flex-col gap-10 sm:gap-16">
        <HomeProfile cmsProfile={profile} snapshot={snapshot} copy={copy} />

        {error ? (
          <SectionLoadError
            eyebrow={copy["home.projects.eyebrow"]}
            title={copy["home.projects.errorTitle"]}
            index="01"
            onRetry={retry}
            pending={isFetching}
            description={copy["home.error.description"]}
            retryLabel={copy["home.error.retryIdle"]}
            retryPendingLabel={copy["home.error.retry"]}
          />
        ) : projects.length > 0 ? (
          <DeferredSection>
            <Suspense fallback={<DeferredSectionPlaceholder />}>
              <HomeProjects projects={projects} copy={copy} />
            </Suspense>
          </DeferredSection>
        ) : null}

        {error ? (
          <SectionLoadError
            eyebrow={copy["home.experience.eyebrow"]}
            title={copy["home.experience.errorTitle"]}
            index="02"
            onRetry={retry}
            pending={isFetching}
            description={copy["home.error.description"]}
            retryLabel={copy["home.error.retryIdle"]}
            retryPendingLabel={copy["home.error.retry"]}
          />
        ) : isLoading ? (
          <DeferredSectionPlaceholder />
        ) : experiences.length > 0 ? (
          <DeferredSection>
            <Suspense fallback={<DeferredSectionPlaceholder />}>
              <HomeExperiences experiences={experiences} copy={copy} />
            </Suspense>
          </DeferredSection>
        ) : null}

        <HomeAbout cmsSkills={skills} copy={copy} />

        {error ? (
          <Suspense fallback={<DeferredSectionPlaceholder />}>
            <HomeGithub copy={copy} />
          </Suspense>
        ) : (
          <DeferredGithub copy={copy} />
        )}
      </PageContainer>
    </>
  );
}
