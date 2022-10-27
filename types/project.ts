import { TImage } from "./image";

export type TProject = {
  id: string;
  slug: string;
  name: string;
  image: TImage;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};
