export type ArticleContentType = "case-study" | "tutorial" | "engineering-note" | "commentary";
export type ArticleChannel = "portfolio" | "linkedin" | "x";
export type ArticlePrivacyClassification = "public-source" | "private-source";
export type ArticleClaimKind = "fact" | "opinion";

export interface ArticleReference {
  id: string;
  title: string;
  url: string;
}

export interface ArticleClaim {
  id: string;
  kind: ArticleClaimKind;
  statement: string;
  referenceIds: string[];
}

export interface ArticleSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  keywords: string[];
}

export interface LinkedInSocialVariant {
  channel: "linkedin";
  text: string;
  hashtags: string[];
}

export interface XSocialVariant {
  channel: "x";
  posts: string[];
}

export interface ArticleSocialVariants {
  linkedin: LinkedInSocialVariant | null;
  x: XSocialVariant | null;
}

export interface ArticleReadingTime {
  wordCount: number;
  minutes: number;
}

export interface ArticlePublicContent {
  contentType: ArticleContentType;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  contentMarkdown: string;
  targetChannels: ArticleChannel[];
  seo: ArticleSeo;
  socialVariants: ArticleSocialVariants;
  references: ArticleReference[];
  claims: ArticleClaim[];
  readingTime: ArticleReadingTime;
}

export interface ArticleRevision {
  id: string;
  articleId: string;
  revisionNumber: number;
  schemaVersion: number;
  contentPolicyVersion: number;
  contentSha256: string;
  createdAt: string;
  publicContent: ArticlePublicContent;
}

export interface ArticleRevisionSummary {
  id: string;
  articleId: string;
  revisionNumber: number;
  schemaVersion: number;
  contentPolicyVersion: number;
  contentSha256: string;
  createdAt: string;
  title: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  contentType: ArticleContentType;
  latestRevisionNumber: number;
  title: string;
  excerpt: string;
  targetChannels: ArticleChannel[];
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  contentType: ArticleContentType;
  latestRevisionNumber: number;
  createdAt: string;
  updatedAt: string;
  currentDraftRevision: ArticleRevision;
}

export type ReviewState = "draft" | "in_review" | "approved" | "changes_requested";

export interface ReviewDecision {
  sequence: number;
  command: "submit" | "approve" | "request_changes" | "revoke";
  fromState: ReviewState;
  toState: ReviewState;
  actor: { email: string };
  note: string | null;
  createdAt: string;
}

export interface ArticleReview {
  articleId: string;
  revisionId: string;
  revisionNumber: number;
  contentSha256: string;
  state: ReviewState;
  blockers: string[];
  decisions: ReviewDecision[];
}

export interface PublicArticleSummary {
  id: string;
  slug: string;
  contentType: ArticleContentType;
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
  publishedAt: string;
  publishedRevisionNumber: number;
}

export interface PublicArticle {
  id: string;
  slug: string;
  contentType: ArticleContentType;
  publishedAt: string;
  publishedRevisionNumber: number;
  publicContent: ArticlePublicContent;
}
