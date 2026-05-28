import { adminDb } from './firebase-admin';
import type { CommunityPost, CreatePostInput, TimelineEvent, AppShowcase } from '@/types';

const POSTS_COLLECTION = 'community_posts';
const TIMELINE_COLLECTION = 'timeline_events';
const APPS_COLLECTION = 'app_showcases';

// ==================== COMMUNITY POSTS ====================

export async function getCommunityPosts(
  options: {
    limit?: number;
    status?: string;
    pillar?: string;
    orderBy?: 'createdAt' | 'upvotes' | 'commentCount';
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<CommunityPost[]> {
  const { limit = 25, status = 'published', orderBy = 'createdAt', orderDirection = 'desc' } = options;

  let query = adminDb.collection(POSTS_COLLECTION)
    .where('status', '==', status)
    .orderBy(orderBy, orderDirection)
    .limit(limit);

  if (status === 'all') {
    query = adminDb.collection(POSTS_COLLECTION)
      .orderBy(orderBy, orderDirection)
      .limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
}

export async function getCommunityPost(id: string): Promise<CommunityPost | null> {
  const doc = await adminDb.collection(POSTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as CommunityPost;
}

export async function createCommunityPost(input: CreatePostInput): Promise<string> {
  const now = new Date().toISOString();
  const post: Omit<CommunityPost, 'id'> = {
    title: input.title || '',
    content: input.content,
    author: input.author || 'pawme_bot',
    authorName: input.author === 'ashok' ? 'Ashok Jaiswal' : 'PawMe Bot',
    authorAvatar: input.author === 'ashok' ? '/avatars/ashok.png' : '/avatars/pawme-bot.png',
    imageUrls: input.imageUrls || [],
    videoUrl: input.videoUrl,
    upvotes: 0,
    commentCount: 0,
    pillar: input.pillar,
    tags: input.tags || [],
    createdAt: now,
    updatedAt: now,
    status: input.scheduledAt ? 'scheduled' : 'published',
    platforms: input.platforms || 'both',
    scheduledAt: input.scheduledAt,
    sourceType: input.sourceType,
    sourceUrl: input.sourceUrl,
  };

  const docRef = await adminDb.collection(POSTS_COLLECTION).add(post);
  return docRef.id;
}

export async function updateCommunityPostStatus(
  id: string,
  status: CommunityPost['status'],
  extraData?: Record<string, unknown>
): Promise<void> {
  await adminDb.collection(POSTS_COLLECTION).doc(id).update({
    status,
    updatedAt: new Date().toISOString(),
    ...extraData,
  });
}

export async function getScheduledPosts(): Promise<CommunityPost[]> {
  const now = new Date().toISOString();
  const snapshot = await adminDb.collection(POSTS_COLLECTION)
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now)
    .orderBy('scheduledAt', 'asc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
}

// ==================== TIMELINE EVENTS ====================

export async function getTimelineEvents(
  options: { limit?: number; category?: string } = {}
): Promise<TimelineEvent[]> {
  const { limit = 50, category } = options;

  let query = adminDb.collection(TIMELINE_COLLECTION)
    .orderBy('date', 'desc')
    .limit(limit);

  if (category) {
    query = adminDb.collection(TIMELINE_COLLECTION)
      .where('category', '==', category)
      .orderBy('date', 'desc')
      .limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
}

export async function createTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<string> {
  const docRef = await adminDb.collection(TIMELINE_COLLECTION).add(event);
  return docRef.id;
}

// ==================== APPS ====================

export async function getApps(): Promise<AppShowcase[]> {
  const snapshot = await adminDb.collection(APPS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppShowcase));
}

export async function getAppBySlug(slug: string): Promise<AppShowcase | null> {
  const snapshot = await adminDb.collection(APPS_COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as AppShowcase;
}

export async function createApp(app: Omit<AppShowcase, 'id'>): Promise<string> {
  const docRef = await adminDb.collection(APPS_COLLECTION).add(app);
  return docRef.id;
}
