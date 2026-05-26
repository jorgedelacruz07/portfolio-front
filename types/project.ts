import { TImage } from "./image";
import { TTechnology } from "./technology";

export type TProject = {
  id: string;
  slug: string;
  name: string;
  type: string;
  image?: TImage;
  url?: string;
  description: string;
  longDescription?: string | null;
  links?: {
    live?: string | null;
    github?: string | null;
    caseStudy?: string | null;
  } | null;
  featured?: boolean;
  displayOrder?: number;
  from: string | null;
  to: string | null;
  status?: boolean;
  technologyIds?: string[];
  technologies: TTechnology[];
  createdAt: string;
  updatedAt: string;
};
