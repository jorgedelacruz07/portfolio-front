import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeAbout } from "../components/pages/home/HomeAbout";
import {
  useGetExperiences,
  useGetProjects,
  useGetPosts,
} from "../hooks/queries";
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
    ssr: false,
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
    ssr: false,
    loading: () => (
      <div className="py-16">
        <div className="animate-pulse bg-muted/20 h-64 rounded-lg"></div>
      </div>
    ),
  },
);

const HomeComponent: NextPage = () => {
  const {
    data: experiences = [],
    isLoading: experiencesLoading,
    error: experiencesError,
  } = useGetExperiences();
  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjects();
  const {
    data: _posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useGetPosts();

  const isLoading = useMemo(
    () => experiencesLoading || projectsLoading || postsLoading,
    [experiencesLoading, projectsLoading, postsLoading],
  );

  const hasError = useMemo(
    () => experiencesError || projectsError || postsError,
    [experiencesError, projectsError, postsError],
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (hasError) {
    return (
      <div className={classConstants.loadingContainer}>
        <div className={classConstants.errorContainer}>
          <h1 className={classConstants.errorHeading}>Error loading content</h1>
          <p className={classConstants.errorText}>
            {hasError instanceof Error
              ? hasError.message
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
      <HomeProfile />
      <HomeAbout />

      {experiences.length > 0 && (
        <>
          <Separator className="my-8" />
          <HomeExperiences experiences={experiences.slice(0, 3)} />
        </>
      )}

      {projects.length > 0 && (
        <>
          <Separator className="my-8" />
          <HomeProjects projects={projects.slice(0, 3)} />
        </>
      )}
    </div>
  );
};

const Home = memo(HomeComponent);
Home.displayName = "Home";
export default Home;
