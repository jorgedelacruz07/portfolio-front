import { TProject } from '../types/project';
import { TExperience } from '../types/experience';
import { TPost } from '../types/post';
import { TCategory } from '../types/category';

// Fallback data when API is not available
export const fallbackData = {
  projects: [] as TProject[],
  experiences: [] as TExperience[],
  posts: [] as TPost[],
  categories: [] as TCategory[],
};

// Helper function to safely get data with fallback
export const safeGetData = <T>(data: T | undefined | null, fallback: T): T => {
  if (data === undefined || data === null) {
    return fallback;
  }
  return data;
};

// Helper function to ensure array data
export const ensureArray = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};
