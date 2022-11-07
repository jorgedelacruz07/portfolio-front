import { TCategory } from "./category";
import { TImage } from "./image";
import { TTag } from "./tag";

export type TPost = {
  id: string;
  slug: string;
  title: string;
  image: TImage;
  body: string;
  status: boolean;
  categoryIds: string[];
  categories: TCategory[];
  tagIds: string[];
  tags: TTag[];
  createdAt: string;
  updatedAt: string;
};
