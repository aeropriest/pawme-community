import Link from 'next/link';
import { getCommunityPosts, getTimelineEvents, getApps } from '@/lib/community-store';
import { SEED_POSTS, SEED_TIMELINE, SEED_APPS } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let posts: any[] = [], events: any[] = [], apps: any[] = [];
  let usingFallback = false;
  
  try {
    [posts, events, apps] = await Promise.all([
      getCommunityPosts({ limit: 50, status: 'all' }),
      getTimelineEvents({ limit: 5 }),
      getApps(),
    ]);
  } catch {
    usingFallback = true;
  }
  
  if (posts.length === 0) {
    posts = SEED_POSTS;
    events = SEED_TIMELINE;
    apps = SEED_APPS;
    usingFallback = true;
  }

  const stats = {
    totalPosts: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    events: events.length,
    apps: apps.length,
    totalUpvotes: posts.reduce((s, p) => s + (p.upvotes || 0), 0),
    totalComments: posts.reduce((s, p) => s + (p.commentCount || 0), 0),
  };

  // Pillar distribution
  const pillarCounts: Record<string, number> = {};
  posts.forEach(p => {
    if (p.pillar) pillarCounts[p.pillar] = (pillarCounts[p.pillar] || 0) + 1;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Manage content, schedule posts, and track publishing
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/posts/new" style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'var(--accent-orange)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}>+ New Post</Link>
          <Link href="/admin/timeline" style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}>Timeline</Link>
        </div>
      </div>

      {usingFallback && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          fontSize: 13,
          color: '#f59e0b',
        }}>
          ⚠️ <strong>Offline Mode:</strong> Showing seed data. Connect Firebase to enable full admin features, real-time updates, and publishing to X/Telegram.
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Published', value: stats.published, color: 'var(--accent-green)' },
          { label: 'Drafts', value: stats.draft, color: '#f59e0b' },
          { label: 'Timeline Events', value: stats.events, color: 'var(--accent-blue)' },
          { label: 'Total Upvotes', value: stats.totalUpvotes, color: 'var(--accent-orange)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-secondary)',
            borderRadius: 10,
            padding: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pillar distribution */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 10,
        padding: '20px',
        border: '1px solid var(--border-color)',
        marginBottom: 32,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Content Pillars</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { key: 'build_in_public', label: '🔨 Build In Public', color: '#ff4500' },
            { key: 'product_showcase', label: '🚀 Product', color: '#04DA8D' },
            { key: 'founder_voice', label: '🎤 Founder', color: '#8E54E9' },
            { key: 'community_prompt', label: '💬 Community', color: '#0085FF' },
            { key: 'market_context', label: '📊 Market', color: '#f59e0b' },
          ].map(pillar => (
            <div key={pillar.key} style={{
              background: `${pillar.color}10`,
              borderRadius: 8,
              padding: '12px',
              textAlign: 'center',
              border: `1px solid ${pillar.color}30`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: pillar.color }}>{pillarCounts[pillar.key] || 0}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{pillar.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        {[
          { label: '📝 Posts', href: '/admin/posts', count: posts.length },
          { label: '📅 Timeline', href: '/admin/timeline', count: events.length },
          { label: '📱 Apps', href: '/admin/apps', count: apps.length },
          { label: '🖼️ Gallery', href: '/gallery', count: undefined },
          { label: '📱 Social', href: '/admin/social', count: undefined },
        ].map(nav => (
          <Link key={nav.label} href={nav.href} style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            background: nav.href === '/admin' ? 'var(--bg-tertiary)' : 'transparent',
            color: nav.href === '/admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}>
            {nav.label} {nav.count !== undefined ? `(${nav.count})` : ''}
          </Link>
        ))}
      </div>

      {/* Posts table */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 120px 100px 100px 100px', gap: 12, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <span>Post</span>
          <span>Status</span>
          <span>Pillar</span>
          <span>Engagement</span>
          <span>Source</span>
        </div>
        {posts.slice(0, 20).map(post => (
          <div key={post.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: '2fr 120px 100px 100px 100px',
            gap: 12,
            alignItems: 'center',
            fontSize: 13,
          }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>{post.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.authorName}</div>
            </div>
            <span style={{
              padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, width: 'fit-content',
              background: post.status === 'published' ? 'rgba(4,218,141,0.15)' : post.status === 'scheduled' ? 'rgba(0,133,255,0.15)' : 'rgba(245,158,11,0.15)',
              color: post.status === 'published' ? 'var(--accent-green)' : post.status === 'scheduled' ? 'var(--accent-blue)' : '#f59e0b',
            }}>
              {post.status}
            </span>
            <span style={{
              fontSize: 11,
              color: post.pillar === 'build_in_public' ? '#ff4500' : post.pillar === 'product_showcase' ? '#04DA8D' : 'var(--text-secondary)',
            }}>
              {post.pillar?.replace('_', ' ') || '—'}
            </span>
            <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
              <span style={{ color: 'var(--upvote-orange)' }}>▲ {post.upvotes}</span>
              <span style={{ color: 'var(--text-muted)' }}>💬 {post.commentCount}</span>
            </div>
            <span style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              padding: '2px 6px',
              borderRadius: 4,
            }}>
              {post.sourceType?.replace('_', ' ') || '—'}
            </span>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No posts yet. Connect Firebase or create your first post.</p>
          </div>
        )}
      </div>

      {posts.length > 20 && (
        <div style={{ textAlign: 'center', padding: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          Showing 20 of {posts.length} posts
        </div>
      )}
    </div>
  );
}
