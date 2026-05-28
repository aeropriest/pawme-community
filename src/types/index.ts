export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type PostPlatform = 'x' | 'telegram' | 'both';
export type ApprovalStatus = 'draft' | 'flagged' | 'approved' | 'published';
export type ContentPillar = 'build_in_public' | 'product_showcase' | 'founder_voice' | 'community_prompt' | 'market_context';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: 'ashok' | 'pawme_bot' | 'community';
  authorName: string;
  authorAvatar?: string;
  imageUrls?: string[];
  videoUrl?: string;
  upvotes: number;
  commentCount: number;
  pillar?: ContentPillar;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: PostStatus;
  platforms: PostPlatform;
  approvalStatus?: ApprovalStatus;
  scheduledAt?: string;
  xPostId?: string;
  telegramMessageId?: number;
  sourceUrl?: string;
  sourceType?: 'whatsapp' | 'meeting_notes' | 'dev_log' | 'press' | 'community' | 'git_history';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'prototype' | 'design' | 'firmware' | 'software' | 'manufacturing' | 'media' | 'partnership' | 'award' | 'milestone';
  imageUrls?: string[];
  videoUrl?: string;
  gitCommitSha?: string;
  gitCommitUrl?: string;
  sourceType: 'whatsapp' | 'meeting_notes' | 'dev_log' | 'press' | 'git_history';
  sourceUrl?: string;
  createdAt: string;
}

export interface AppShowcase {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  screenshotUrls: string[];
  videoUrl?: string;
  features: string[];
  techStack: string[];
  githubUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  status: 'active' | 'beta' | 'development' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title?: string;
  content: string;
  author?: CommunityPost['author'];
  imageUrls?: string[];
  videoUrl?: string;
  pillar?: ContentPillar;
  tags?: string[];
  platforms?: PostPlatform;
  scheduledAt?: string;
  sourceType?: CommunityPost['sourceType'];
  sourceUrl?: string;
}
