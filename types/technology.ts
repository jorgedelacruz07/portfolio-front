import { TExperience } from "./experience";
import { TProject } from "./project";

export type TTechnology = {
  id: string;
  name: string;
  projectIds: string[];
  projects: TProject[];
  experienceIds: string[];
  experiences: TExperience[];
  createdAt: string;
  updatedAt: string;
};
