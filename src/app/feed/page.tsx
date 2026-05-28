import { getCommunityPosts } from '@/lib/community-store';

const PILLAR_LABELS: Record<string, { label: string; color: string }> = {
  build_in_public: { label: '🔨 Build In Public', color: '#ff4500' },
  product_showcase: { label: '🚀 Product', color: '#04DA8D' },
  founder_voice: { label: '🎤 Founder', color: '#8E54E9' },
  community_prompt: { label: '💬 Community', color: '#0085FF' },
  market_context: { label: '📊 Market', color: '#f59e0b' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function FeedPage() {
  let posts: Awaited<ReturnType<typeof getCommunityPosts>> = [];
  try {
    posts = await getCommunityPosts({ limit: 25 });
  } catch {
    // Firebase not configured yet — show placeholder
  }

  // Fallback demo content when DB is empty
  const demoPosts = posts.length === 0 ? [{
    id: 'demo-1',
    title: 'Welcome to r/PawMeBot — Our Build-In-Public Hub! 🐾',
    content: 'This is where we share everything about building PawMe — from ESP32 firmware to PCB designs, from prototype videos to manufacturing wins (and failures). Think of it as the living diary of a hardware startup.\n\nWe&apos;ll be posting daily with behind-the-scenes content, technical deep-dives, and community polls. Stick around!',
    author: 'ashok' as const,
    authorName: 'Ashok Jaiswal',
    authorAvatar: '/avatars/ashok.png',
    upvotes: 42,
    commentCount: 8,
    pillar: 'build_in_public' as const,
    tags: ['welcome', 'build_in_public', 'community'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published' as const,
    platforms: 'both' as const,
    imageUrls: [],
  }, {
    id: 'demo-2',
    title: 'Prototype v3: First successful head tilt with servo + IMU fusion 🤖',
    content: 'Today we got the head tilt mechanism working with proper IMU feedback. The MPU6050 feeds accelerometer data at 200Hz, and the PID loop keeps the head level within ±2° even when the body is moving.\n\nNext step: adding camera-based face tracking to make the head follow pets automatically.',
    author: 'pawme_bot' as const,
    authorName: 'PawMe Bot',
    authorAvatar: '/avatars/pawme-bot.png',
    upvotes: 87,
    commentCount: 23,
    pillar: 'product_showcase' as const,
    tags: ['prototype', 'firmware', 'imu', 'esp32'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'published' as const,
    platforms: 'both' as const,
    imageUrls: [],
  }, {
    id: 'demo-3',
    title: 'Origin Story: From BB-8 Dreams to a Real Robot 🎬',
    content: 'It started with a simple question: what if Sphero&apos;s BB-8 had AI — could actually see, think, and care for your pet?\n\n8 countries. 4 prototypes. 355 build photos. 27 dev videos. 1 patent filed.\n\nThis is the story of PawMe — an open-source AI companion robot for pets, built from scratch by one person who refused to give up.',
    author: 'ashok' as const,
    authorName: 'Ashok Jaiswal',
    authorAvatar: '/avatars/ashok.png',
    upvotes: 156,
    commentCount: 45,
    pillar: 'founder_voice' as const,
    tags: ['origin_story', 'hardware', 'journey'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'published' as const,
    platforms: 'both' as const,
    imageUrls: [],
  }] : posts;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
      {/* Main Feed */}
      <div>
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
          {['hot', 'new', 'top'].map(sort => (
            <button key={sort} style={{
              background: sort === 'hot' ? 'var(--bg-tertiary)' : 'transparent',
              border: 'none',
              color: sort === 'hot' ? 'var(--text-primary)' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}>
              {sort === 'hot' ? '🔥 Hot' : sort === 'new' ? '✨ New' : '📈 Top'}
            </button>
          ))}
        </div>

        {/* Posts */}
        {demoPosts.map(post => (
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
                <span>u/{post.author === 'ashok' ? 'ashokjaiswal' : 'pawme_bot'}</span>
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
                {post.content.substring(0, 300)}{post.content.length > 300 ? '...' : ''}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {post.tags?.slice(0, 4).map(tag => (
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
          <div style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', height: 60 }} />
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>r/PawMeBot</h3>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The official community for PawMe — an open-source AI-powered wheeled companion robot for pets. Build-in-public since day one.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>1.2k</strong> members</span>
              <span><strong style={{ color: 'var(--text-primary)' }}>24</strong> online</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          padding: 16,
        }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="https://pawmebot.com" style={{ fontSize: 13 }}>🌐 pawmebot.com</a>
            <a href="https://x.com/pawme_ai" style={{ fontSize: 13 }}>🐦 @pawme_ai</a>
            <a href="https://github.com/ayvalabs" style={{ fontSize: 13 }}>💻 GitHub</a>
            <a href="/timeline" style={{ fontSize: 13 }}>📅 Full Timeline</a>
            <a href="/apps" style={{ fontSize: 13 }}>📱 Apps</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
