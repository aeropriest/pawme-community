import { getCommunityPosts } from '@/lib/community-store';
import { SEED_POSTS } from '@/lib/seed-data';
import { getPlatformStatus } from '@/lib/social-publisher';
import SocialPostCard from './SocialPostCard';

export const dynamic = 'force-dynamic';

export default async function SocialPage() {
  let posts: any[] = [];
  try {
    posts = await getCommunityPosts({ limit: 50, status: 'all' });
  } catch {}
  if (posts.length === 0) posts = SEED_POSTS;

  const platformStatus = getPlatformStatus();
  const connectedCount = platformStatus.filter(p => p.configured).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>📱 Social Media Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Post to X, Instagram, TikTok, Facebook, YouTube, and Reddit — instantly or scheduled
          </p>
        </div>
      </div>

      {/* Platform status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 32 }}>
        {platformStatus.map(p => (
          <div key={p.key} style={{
            background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
            border: `1px solid ${p.configured ? 'var(--accent-green)' : 'var(--border-color)'}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>
              {p.key === 'x' ? '🐦' : p.key === 'ig' ? '📸' : p.key === 'tt' ? '🎵' : p.key === 'fb' ? '👤' : p.key === 'yt' ? '▶️' : '🤖'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
            <div style={{
              fontSize: 10, marginTop: 4, padding: '2px 8px', borderRadius: 8,
              background: p.configured ? 'rgba(4,218,141,0.15)' : 'rgba(245,158,11,0.1)',
              color: p.configured ? 'var(--accent-green)' : '#f59e0b',
              display: 'inline-block',
            }}>
              {p.configured ? '✓ Ready' : '⚙ Setup'}
            </div>
            {!p.configured && (
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
                Need: {p.envVar.split(',')[0]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick compose */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 12, padding: '20px 24px',
        border: '1px solid var(--border-color)', marginBottom: 32,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>✏️ Quick Compose</h3>
        <textarea
          id="quickCompose"
          placeholder="What's happening with PawMe? Share a build update, milestone, or thought..."
          style={{
            width: '100%', minHeight: 100, background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)', borderRadius: 8,
            padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14,
            resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {platformStatus.map(p => (
              <label key={p.key} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                background: p.configured ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                borderRadius: 8, fontSize: 12, cursor: p.configured ? 'pointer' : 'not-allowed',
                opacity: p.configured ? 1 : 0.5,
              }}>
                <input type="checkbox" name="platform" value={p.key} defaultChecked={p.configured} disabled={!p.configured} />
                {p.name}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => alert('Schedule modal would open here')}
              style={{
                padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                border: 'none', cursor: 'pointer',
              }}
            >
              📅 Schedule
            </button>
            <form action="/api/social/post" method="POST">
              <input type="hidden" name="postId" value="quick" />
              <button type="submit" style={{
                padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: 'var(--accent-orange)', color: '#fff',
                border: 'none', cursor: 'pointer',
              }}>
                ⚡ Post Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Posts with social actions */}
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>
        📝 Posts ({posts.length}) — Click any platform button to post instantly
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {posts.map(post => (
          <SocialPostCard key={post.id} post={post} platformStatus={platformStatus} />
        ))}
      </div>
    </div>
  );
}
