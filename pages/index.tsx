import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeAbout } from "../components/pages/home/HomeAbout";
import { useHomePageData, useNearScreen } from "../hooks";
import { PageLoader } from "../components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { classConstants } from "@/lib/class-constants";

// Dynamic imports for below-the-fold components
const HomeProjects = dynamic(
  () =>
    import("../components/pages/home/HomeProjects").then((mod) => ({
      default: mod.HomeProjects,
    })),
  {
    loading: () => (
      <div className="py-16">
        <div className="animate-pulse bg-muted/20 h-64 rounded-lg"></div>
      </div>
    ),
  },
);

const HomeExperiences = dynamic(
  () => import("../components/pages/home/HomeExperiences"),
  {
    loading: () => (
      <div className="py-16">
        <div className="animate-pulse bg-muted/20 h-64 rounded-lg"></div>
      </div>
    ),
  },
);

const HomeBlog = dynamic(() => import("../components/pages/home/HomeBlog"), {
  loading: () => (
    <div className="py-16">
      <div className="animate-pulse bg-muted/20 h-64 rounded-lg"></div>
    </div>
  ),
});

const Home: NextPage = () => {
  const { experiences, projects, posts, isLoading, error } = useHomePageData();

  // Custom Intersection Observer hooks for aggressive code splitting
  // Chunks are not requested until user scrolls within 200px
  const { isNearScreen: isExperiencesNear, fromRef: experiencesRef } = useNearScreen("200px");
  const { isNearScreen: isProjectsNear, fromRef: projectsRef } = useNearScreen("200px");
  const { isNearScreen: isBlogNear, fromRef: blogRef } = useNearScreen("200px");

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className={classConstants.loadingContainer}>
        <div className={classConstants.errorContainer}>
          <h1 className={classConstants.errorHeading}>Error loading content</h1>
          <p className={classConstants.errorText}>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <Head>
        <link rel="preload" as="image" href="/images/jorge.jpg" />
      </Head>
      <HomeProfile />
      <HomeAbout />

      {experiences.length > 0 && (
        <div ref={experiencesRef} className="min-h-[50vh]">
          {isExperiencesNear && (
            <>
              <Separator className="my-8" />
              <HomeExperiences experiences={experiences} />
            </>
          )}
        </div>
      )}

      {projects.length > 0 && (
        <div ref={projectsRef} className="min-h-[50vh]">
          {isProjectsNear && (
            <>
              <Separator className="my-8" />
              <HomeProjects projects={projects} />
            </>
          )}
        </div>
      )}

      {posts.length > 0 && (
        <div ref={blogRef} className="min-h-[50vh]">
          {isBlogNear && (
            <>
              <Separator className="my-8" />
              <HomeBlog posts={posts} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
