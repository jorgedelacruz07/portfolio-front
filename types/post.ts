import { TImage } from "./image";

export type TTag = {
  id: string;
  name: string;
  postIds: string[];
  posts: TPost[];
  createdAt: string;
  updatedAt: string;
};

export type TCategory = {
  id: string;
  slug: string;
  name: string;
  postIds: string[];
  posts: TPost[];
  createdAt: string;
  updatedAt: string;
};

export type TPost = {
  id: string;
  slug: string;
  title: string;
  image: TImage;
  body: string;
  categoryIds: string[];
  categories: TCategory[];
  tagIds: string[];
  tags: TTag[];
  createdAt: string;
  updatedAt: string;
};
