import { type ReactNode, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";

import { HomeAbout } from "@/components/pages/home/HomeAbout";
import { HomeProfile } from "@/components/pages/home/HomeProfile";
import { PageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useDeferredRender, useHomePageData } from "@/hooks";
import { cn, homePageStyles } from "@/lib/utils";

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

const HomeBlog = lazy(() =>
  import("@/components/pages/home/HomeBlog").then((module) => ({
    default: module.HomeBlog,
  })),
);

type DeferredSectionProps = {
  children: ReactNode;
  className?: string;
};

function DeferredSectionPlaceholder() {
  return (
    <div className="min-h-[24rem] rounded-[2rem] border border-dashed border-border/70 bg-card/40" />
  );
}

function DeferredSection({ children, className }: DeferredSectionProps) {
  const { ref, shouldRender } = useDeferredRender();

  return (
    <div ref={ref} className={cn("min-h-[24rem]", className)}>
      {shouldRender ? children : <DeferredSectionPlaceholder />}
    </div>
  );
}

function HomeErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-[2rem] border border-border/70 bg-card/85 p-8 text-center shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
          Content error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          The homepage content could not be loaded.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-6 h-11 rounded-full px-5 text-sm font-semibold"
        >
          Reload page
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { experiences, projects, posts, isLoading, error } = useHomePageData();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <HomeErrorState
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching the latest data."
        }
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Jorge de la Cruz | Senior Software Engineer</title>
        <meta
          name="description"
          content="Senior Software Engineer specializing in React.js, TypeScript, and Node.js. Building scalable web applications since 2016."
        />
        <link rel="preload" as="image" href="/images/jorge.jpg" />
      </Helmet>

      <div className={homePageStyles.page}>
        <HomeProfile />
        <HomeAbout />

        {experiences.length > 0 ? (
          <DeferredSection>
            <Suspense fallback={<DeferredSectionPlaceholder />}>
              <HomeExperiences experiences={experiences} />
            </Suspense>
          </DeferredSection>
        ) : null}

        {projects.length > 0 ? (
          <DeferredSection>
            <Suspense fallback={<DeferredSectionPlaceholder />}>
              <HomeProjects projects={projects} />
            </Suspense>
          </DeferredSection>
        ) : null}

        {posts.length > 0 ? (
          <DeferredSection>
            <Suspense fallback={<DeferredSectionPlaceholder />}>
              <HomeBlog posts={posts} />
            </Suspense>
          </DeferredSection>
        ) : null}
      </div>
    </>
  );
}
