import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { HomeAbout } from "@/components/pages/home/HomeAbout";
import { HomeProfile } from "@/components/pages/home/HomeProfile";
import { PageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useHomePageData, useDeferredRender } from "@/hooks";
import { cn, homePageStyles } from "@/lib/utils";

const HomeProjects = dynamic(
  () =>
    import("@/components/pages/home/HomeProjects").then((module) => ({
      default: module.HomeProjects,
    })),
  { loading: () => <DeferredSectionPlaceholder /> },
);

const HomeExperiences = dynamic(
  () =>
    import("@/components/pages/home/HomeExperiences").then((module) => ({
      default: module.HomeExperiences,
    })),
  { loading: () => <DeferredSectionPlaceholder /> },
);

const HomeBlog = dynamic(
  () =>
    import("@/components/pages/home/HomeBlog").then((module) => ({
      default: module.HomeBlog,
    })),
  { loading: () => <DeferredSectionPlaceholder /> },
);

type DeferredSectionProps = {
  children: ReactNode;
  className?: string;
};

const DeferredSectionPlaceholder = () => {
  return (
    <div className="min-h-[24rem] rounded-[2rem] border border-dashed border-border/70 bg-card/40" />
  );
};

const DeferredSection = ({ children, className }: DeferredSectionProps) => {
  const { ref, shouldRender } = useDeferredRender();

  return (
    <div ref={ref} className={cn("min-h-[24rem]", className)}>
      {shouldRender ? children : <DeferredSectionPlaceholder />}
    </div>
  );
};

const HomeErrorState = ({ message }: { message: string }) => {
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
};

const Home: NextPage = () => {
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
      <Head>
        <link rel="preload" as="image" href="/images/jorge.jpg" />
      </Head>

      <div className={homePageStyles.page}>
        <HomeProfile />
        <HomeAbout />

        {experiences.length > 0 ? (
          <DeferredSection>
            <HomeExperiences experiences={experiences} />
          </DeferredSection>
        ) : null}

        {projects.length > 0 ? (
          <DeferredSection>
            <HomeProjects projects={projects} />
          </DeferredSection>
        ) : null}

        {posts.length > 0 ? (
          <DeferredSection>
            <HomeBlog posts={posts} />
          </DeferredSection>
        ) : null}
      </div>
    </>
  );
};

export default Home;
