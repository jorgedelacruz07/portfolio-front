import { TImage } from "./image";
import { TPost } from "./post";

export type TCategory = {
  id: string;
  slug: string;
  name: string;
  image: TImage;
  postIds: string[];
  posts: TPost[];
  createdAt: string;
  updatedAt: string;
};
