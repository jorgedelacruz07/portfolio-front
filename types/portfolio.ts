import { TExperience } from "./experience";
import { TProject } from "./project";

export type TProfile = {
  id?: string;
  name: string;
  headline: string;
  shortBio: string;
  location: string;
  availability: string;
  profileImage?: { src: string } | null;
  resumeUrl?: string | null;
  contactEmail: string;
  socialLinks: { label: string; url: string }[];
};

export type TSkill = {
  id?: string;
  name: string;
  category: string;
  level?: string | null;
  priority: number;
  displayOrder: number;
  visible: boolean;
};

export type TSiteSettings = {
  id?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  openGraphImage?: string | null;
  contactEmail: string;
  availabilityText: string;
  footerText: string;
  siteCopy?: Record<string, string>;
};

export type TPortfolioContent = {
  profile: TProfile;
  settings: TSiteSettings;
  skills: TSkill[];
  projects: TProject[];
  experiences: TExperience[];
};

export type TPublicSiteContent = Pick<TPortfolioContent, "profile" | "settings">;
