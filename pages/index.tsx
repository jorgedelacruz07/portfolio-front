import type { NextPage } from "next";
import { HomeProfile } from "../components/pages/home/HomeProfile";
import { HomeProjects } from "../components/pages/home/HomeProjects";
import HomeExperiences from "../components/pages/home/HomeExperiences";
import { useGetExperiences, useGetProjects, useGetPosts } from "../hooks/queries";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Home: NextPage = () => {
  const { data: experiences = [], isLoading: experiencesLoading, error: experiencesError } = useGetExperiences();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useGetProjects();
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useGetPosts();

  const isLoading = experiencesLoading || projectsLoading || postsLoading;
  const hasError = experiencesError || projectsError || postsError;

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error loading content</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {hasError instanceof Error ? hasError.message : 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-cyan-600 hover:text-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      <HomeProfile />
      {experiences.length > 0 && <HomeExperiences experiences={experiences.slice(0, 3)} />}
      {projects.length > 0 && <HomeProjects projects={projects.slice(0, 3)} />}
    </div>
  );
};

export default Home;
