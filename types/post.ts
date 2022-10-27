import { TImage } from "./image";

export type TPost = {
  id: string;
  slug: string;
  title: string;
  image: TImage;
  body: string;
  createdAt: string;
  updatedAt: string;
};
