import type { NextPage } from "next";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeAbout } from "../components/pages/home/HomeAbout";
import { HomeProjects } from "../components/pages/home/HomeProjects";
import HomeExperiences from "../components/pages/home/HomeExperiences";
import {
  useGetExperiences,
  useGetProjects,
  useGetPosts,
} from "../hooks/queries";
import { PageLoader } from "../components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { classConstants } from "@/lib/class-constants";

const Home: NextPage = () => {
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
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = useGetPosts();

  const isLoading = experiencesLoading || projectsLoading || postsLoading;
  const hasError = experiencesError || projectsError || postsError;

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

export default Home;
