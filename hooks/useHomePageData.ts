import { useGetExperiences, useGetProjects } from "./queries";

/**
 * Consolidated hook for fetching all data needed by the home page.
 * Handles loading and error states for experiences and projects.
 *
 * @returns Object containing experiences, projects, loading state, and error state
 */
export const useHomePageData = () => {
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

  return {
    /** Featured experiences (first 3) */
    experiences: experiences.slice(0, 3),
    /** Featured projects (first 3) */
    projects: projects.slice(0, 3),
    /** Whether any data is still loading */
    isLoading: experiencesLoading || projectsLoading,
    /** First error encountered, if any */
    error: experiencesError || projectsError,
  };
};
