/**
 * PawMeBot Community — Firestore Seed Script
 * Run with: npx tsx src/lib/seed.ts
 * 
 * Seeds Firestore with all historical content from WhatsApp, Google Drive, git history.
 */

import { adminDb } from './firebase-admin';
import { SEED_POSTS, SEED_TIMELINE, SEED_APPS, type SeedPost, type SeedTimelineEvent, type SeedApp } from './seed-data';

const POSTS_COLLECTION = 'community_posts';
const TIMELINE_COLLECTION = 'timeline_events';
const APPS_COLLECTION = 'app_showcases';

async function seedPosts() {
  console.log(`\n📝 Seeding ${SEED_POSTS.length} community posts...`);
  
  const batch = adminDb.batch();
  let count = 0;
  
  for (const post of SEED_POSTS) {
    const docRef = adminDb.collection(POSTS_COLLECTION).doc(post.id);
    const { id, ...data } = post;
    batch.set(docRef, data);
    count++;
    
    if (count % 250 === 0) {
      await batch.commit();
      console.log(`  Committed ${count} posts...`);
    }
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${count} community posts`);
}

async function seedTimeline() {
  console.log(`\n📅 Seeding ${SEED_TIMELINE.length} timeline events...`);
  
  const batch = adminDb.batch();
  
  for (const event of SEED_TIMELINE) {
    const docRef = adminDb.collection(TIMELINE_COLLECTION).doc(event.id);
    const { id, ...data } = event;
    batch.set(docRef, data);
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${SEED_TIMELINE.length} timeline events`);
}

async function seedApps() {
  console.log(`\n📱 Seeding ${SEED_APPS.length} app showcases...`);
  
  const batch = adminDb.batch();
  
  for (const app of SEED_APPS) {
    const docRef = adminDb.collection(APPS_COLLECTION).doc(app.id);
    const { id, ...data } = app;
    batch.set(docRef, data);
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${SEED_APPS.length} app showcases`);
}

async function verify() {
  console.log('\n📊 Verification:');
  
  const postsSnap = await adminDb.collection(POSTS_COLLECTION).count().get();
  console.log(`  Community posts: ${postsSnap.data().count}`);
  
  const timelineSnap = await adminDb.collection(TIMELINE_COLLECTION).count().get();
  console.log(`  Timeline events: ${timelineSnap.data().count}`);
  
  const appsSnap = await adminDb.collection(APPS_COLLECTION).count().get();
  console.log(`  App showcases: ${appsSnap.data().count}`);
}

async function main() {
  console.log('🚀 PawMeBot Community — Firestore Seed Script');
  console.log('='.repeat(50));
  
  const args = process.argv.slice(2);
  const shouldSeedPosts = args.includes('--posts') || args.includes('--all');
  const shouldSeedTimeline = args.includes('--timeline') || args.includes('--all');
  const shouldSeedApps = args.includes('--apps') || args.includes('--all');
  const shouldClear = args.includes('--clear');
  
  if (shouldClear) {
    console.log('\n⚠️  Clearing existing data...');
    // Note: In production, you'd want to delete in batches
    console.log('  (Manual clear required - delete collections in Firebase Console)');
  }
  
  try {
    if (shouldSeedPosts || (!shouldSeedTimeline && !shouldSeedApps)) {
      await seedPosts();
    }
    if (shouldSeedTimeline || (!shouldSeedPosts && !shouldSeedApps)) {
      await seedTimeline();
    }
    if (shouldSeedApps || (!shouldSeedPosts && !shouldSeedTimeline)) {
      await seedApps();
    }
    
    await verify();
    
    console.log('\n🎉 Seeding complete!');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000/feed to see the community feed');
    console.log('2. Visit http://localhost:3000/timeline to see the build timeline');
    console.log('3. Visit http://localhost:3000/apps to see the app showcase');
    console.log('4. Visit http://localhost:3000/admin to manage content');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    console.log('\nMake sure:');
    console.log('1. FIREBASE_SERVICE_ACCOUNT is set in .env.local');
    console.log('2. Your service account has Firestore write access');
    console.log('3. Firebase project is properly configured');
    process.exit(1);
  }
}

main();
