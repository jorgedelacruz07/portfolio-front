import { TImage } from "./image";
import { TTechnology } from "./technology";

export type TProject = {
  id: string;
  slug: string;
  name: string;
  type: string;
  image?: TImage;
  url: string;
  description: string;
  from: string;
  to: string;
  status: boolean;
  technologyIds: string[];
  technologies: TTechnology[];
  createdAt: string;
  updatedAt: string;
};
