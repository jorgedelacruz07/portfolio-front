import { TImage } from "./image";
import { TTechnology } from "./technology";

export type TProject = {
  id: string;
  slug: string;
  name: string;
  image: TImage;
  url: string;
  description: string;
  from: string;
  to: string;
  technologyIds: string[];
  technologies: TTechnology[];
  createdAt: string;
  updatedAt: string;
};
