import { TPost } from "./post";

export type TTag = {
  id: string;
  name: string;
  postIds: string[];
  posts: TPost[];
  createdAt: string;
  updatedAt: string;
};
