import { getCommunityPosts } from '@/lib/community-store';
import { SEED_POSTS } from '@/lib/seed-data';

const PILLAR_LABELS: Record<string, { label: string; color: string }> = {
  build_in_public: { label: '🔨 Build In Public', color: '#ff4500' },
  product_showcase: { label: '🚀 Product', color: '#04DA8D' },
  founder_voice: { label: '🎤 Founder', color: '#8E54E9' },
  community_prompt: { label: '💬 Community', color: '#0085FF' },
  market_context: { label: '📊 Market', color: '#f59e0b' },
};

function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return 'recently';
  }
}

export default async function FeedPage() {
  let posts: Awaited<ReturnType<typeof getCommunityPosts>> = [];
  let usingFallback = false;
  
  try {
    posts = await getCommunityPosts({ limit: 25 });
  } catch {
    posts = [];
  }
  
  // Use seed data as fallback when Firebase is not connected
  if (posts.length === 0) {
    posts = SEED_POSTS as any;
    usingFallback = true;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      {/* Main Feed */}
      <div>
        {/* Notice if using fallback data */}
        {usingFallback && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            fontSize: 13,
            color: '#f59e0b',
          }}>
            ⚠️ Showing offline data. Connect Firebase to enable real-time updates and admin features.
          </div>
        )}

        {/* Sort bar */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex',
          gap: 16,
          marginBottom: 16,
          border: '1px solid var(--border-color)',
        }}>
          {[
            { key: 'hot', label: '🔥 Hot' },
            { key: 'new', label: '✨ New' },
            { key: 'top', label: '📈 Top' },
          ].map(sort => (
            <button key={sort.key} style={{
              background: sort.key === 'hot' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: sort.key === 'hot' ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              {sort.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {posts.map((post: any) => (
          <article key={post.id} style={{
            background: 'var(--bg-secondary)',
            borderRadius: 8,
            marginBottom: 12,
            border: '1px solid var(--border-color)',
            display: 'flex',
            overflow: 'hidden',
          }}>
            {/* Upvote column */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 44,
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--text-secondary)">
                <path d="M10 3l7 10H3L10 3z" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{post.upvotes}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--text-secondary)">
                <path d="M10 17l-7-10h14l-7 10z" />
              </svg>
            </div>

            {/* Content */}
            <div style={{ padding: '12px 16px', flex: 1 }}>
              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                {post.pillar && PILLAR_LABELS[post.pillar] && (
                  <span style={{
                    background: `${PILLAR_LABELS[post.pillar].color}20`,
                    color: PILLAR_LABELS[post.pillar].color,
                    padding: '2px 8px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 11,
                  }}>
                    {PILLAR_LABELS[post.pillar].label}
                  </span>
                )}
                <span>u/{post.author === 'ashok' ? 'ashokjaiswal' : post.author === 'prithu' ? 'prithu_hazarika' : post.author === 'lalith' ? 'lalith_kumar' : post.author === 'ameya' ? 'ameya_mistry' : post.author === 'pawme_bot' ? 'pawme_bot' : post.author}</span>
                <span>•</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>

              {/* Title */}
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>
                {post.title}
              </h3>

              {/* Body */}
              <p style={{
                margin: '0 0 10px',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line',
              }}>
                {post.content.substring(0, 350)}{post.content.length > 350 ? '...' : ''}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {post.tags.slice(0, 4).map((tag: string) => (
                    <span key={tag} style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--accent-blue)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 500,
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  💬 {post.commentCount} comments
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  📤 Share
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  🔖 Save
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* About */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-green))', height: 60 }} />
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              🐾 r/PawMeBot
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                background: 'rgba(4, 218, 141, 0.15)',
                color: 'var(--accent-green)',
                padding: '3px 10px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
              }}>
                {posts.length} posts
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                build-in-public since July 2025
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The official community for PawMe — an open-source AI-powered wheeled companion robot for pets. Every post is real, extracted from our actual build journey.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>1.2k</strong> members</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          padding: 16,
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>📊 By the Numbers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Build photos</span>
              <span style={{ fontWeight: 600 }}>355+</span>
            </div>
            <div style={{ display: 'flex', justifyContent 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Dev videos</span>
              <span style={{ fontWeight: 600 }}>27+</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Countries</span>
              <span style={{ fontWeight: 600 }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Team members</span>
              <span style={{ fontWeight: 600 }}>6+</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Patents filed</span>
              <span style={{ fontWeight: 600 }}>1</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Apps released</span>
              <span style={{ fontWeight: 600 }}>2</span>
            </div>
          </div>
        </div>

        {/* Content pillars */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          padding: 16,
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>📂 Content Pillars</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(PILLAR_LABELS).map(([key, val]) => {
              const count = posts.filter((p: any) => p.pillar === key).length;
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: val.color }}>{val.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Links */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          padding: 16,
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>🔗 Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="https://pawmebot.com" style={{ fontSize: 13 }}>🌐 pawmebot.com</a>
            <a href="https://x.com/pawme_ai" style={{ fontSize: 13 }}>🐦 @pawme_ai</a>
            <a href="https://github.com/ayvalabs" style={{ fontSize: 13 }}>💻 GitHub (ayvalabs)</a>
            <a href="/timeline" style={{ fontSize: 13 }}>📅 Full Timeline</a>
            <a href="/apps" style={{ fontSize: 13 }}>📱 Apps</a>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
          Built with ❤️ by Ayva Labs • <a href="https://github.com/ayvalabs/pawme-community" style={{ color: 'var(--text-muted)' }}>Open Source</a>
        </div>
      </div>
    </div>
  );
}
