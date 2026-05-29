import Link from 'next/link';
import { getCommunityPosts } from '@/lib/community-store';
import { SEED_POSTS } from '@/lib/seed-data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// Actions
async function schedulePost(formData: FormData) {
  'use server';
  const postId = formData.get('postId') as string;
  const scheduledAt = formData.get('scheduledAt') as string;
  const platforms = formData.get('platforms') as string;
  
  // In production, this would update Firestore
  console.log('Scheduling post:', postId, 'for', scheduledAt, 'on', platforms);
  revalidatePath('/admin');
}

async function publishNow(formData: FormData) {
  'use server';
  const postId = formData.get('postId') as string;
  const platforms = formData.get('platforms') as string;
  
  console.log('Publishing post:', postId, 'now to', platforms);
  revalidatePath('/admin');
}

export default async function SocialPage() {
  let posts: any[] = [];
  try {
    posts = await getCommunityPosts({ limit: 50, status: 'all' });
  } catch {}
  
  if (posts.length === 0) {
    posts = SEED_POSTS;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>📱 Social Media Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Schedule posts, publish instantly, and track engagement across X, Instagram, TikTok, and Reddit
          </p>
        </div>
      </div>

      {/* Platform status */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32,
      }}>
        {[
          { name: 'X (Twitter)', icon: '🐦', status: 'connected', color: '#1DA1F2', handle: '@pawme_ai' },
          { name: 'Instagram', icon: '📸', status: 'not_configured', color: '#E4405F', handle: 'Not connected' },
          { name: 'TikTok', icon: '🎵', status: 'not_configured', color: '#000000', handle: 'Not connected' },
          { name: 'Reddit', icon: '🤖', status: 'not_configured', color: '#FF4500', handle: 'Not connected' },
        ].map(platform => (
          <div key={platform.name} style={{
            background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px',
            border: `1px solid ${platform.status === 'connected' ? platform.color + '40' : 'var(--border-color)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{platform.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{platform.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{platform.handle}</div>
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10,
              background: platform.status === 'connected' ? platform.color + '20' : 'var(--bg-tertiary)',
              color: platform.status === 'connected' ? platform.color : 'var(--text-muted)',
            }}>
              {platform.status === 'connected' ? '✓ Connected' : '⚙ Configure'}
            </span>
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
          placeholder="What's happening with PawMe? Share a build update, milestone, or thought..."
          style={{
            width: '100%', minHeight: 100, background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)', borderRadius: 8,
            padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14,
            resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['🐦 X', '📸 IG', '🎵 TT', '🤖 Reddit'].map(p => (
              <label key={p} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 12,
                cursor: 'pointer',
              }}>
                <input type="checkbox" defaultChecked={p.includes('X')} />
                {p}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
              border: 'none', cursor: 'pointer',
            }}>
              Schedule
            </button>
            <button style={{
              padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: 'var(--accent-orange)', color: '#fff',
              border: 'none', cursor: 'pointer',
            }}>
              Post Now
            </button>
          </div>
        </div>
      </div>

      {/* Existing posts with social actions */}
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>
        📝 Posts Ready to Share ({posts.length})
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {posts.slice(0, 20).map(post => (
          <SocialPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function SocialPostCard({ post }: { post: any }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 20px',
      border: '1px solid var(--border-color)',
      display: 'flex', gap: 16,
    }}>
      {/* Content */}
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>{post.title}</h4>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {post.content.substring(0, 200)}...
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {post.tags?.slice(0, 4).map((tag: string) => (
            <span key={tag} style={{
              fontSize: 11, color: 'var(--accent-blue)',
              background: 'rgba(0,133,255,0.08)',
              padding: '2px 8px', borderRadius: 8,
            }}>#{tag}</span>
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {post.authorName} • ▲ {post.upvotes} • 💬 {post.commentCount}
          </span>
        </div>
      </div>

      {/* Social actions */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        minWidth: 140, justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['🐦', '📸', '🎵', '🤖'].map((icon, i) => (
            <button key={i} style={{
              flex: 1, padding: '8px', borderRadius: 8, fontSize: 16,
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
              cursor: 'pointer', textAlign: 'center',
            }} title={['X', 'Instagram', 'TikTok', 'Reddit'][i]}>
              {icon}
            </button>
          ))}
        </div>
        <button style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          background: 'var(--accent-green)', color: '#0f172a',
          border: 'none', cursor: 'pointer',
        }}>
          ⚡ Post to All
        </button>
        <button style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)', cursor: 'pointer',
        }}>
          📅 Schedule
        </button>
      </div>
    </div>
  );
}
