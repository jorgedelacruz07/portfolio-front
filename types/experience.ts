import { TImage } from "./image";
import { TTechnology } from "./technology";

export type TExperience = {
  id: string;
  slug: string;
  image: TImage;
  company: string;
  companyFrom: string;
  companyDescription: string;
  companyLogo: string;
  companyUrl?: string;
  jobTitle: string;
  jobDescription: string;
  from: string;
  to: string | null;
  technologyIds: string[];
  technologies: TTechnology[];
  createdAt: string;
  updatedAt: string;
};
