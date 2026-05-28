import Link from 'next/link';
import { getCommunityPosts, getTimelineEvents, getApps } from '@/lib/community-store';

export const dynamic = 'force-dynamic';

async function AdminPage() {
  let posts: any[] = [], events: any[] = [], apps: any[] = [];
  try {
    [posts, events, apps] = await Promise.all([
      getCommunityPosts({ limit: 20, status: 'all' }),
      getTimelineEvents({ limit: 5 }),
      getApps(),
    ]);
  } catch {
    // Firebase not configured
  }

  const stats = {
    totalPosts: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
    events: events.length,
    apps: apps.length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>Manage content, schedule posts, and track publishing</p>
        </div>
        <Link href="/admin/new-post" style={{
          padding: '10px 20px',
          borderRadius: 8,
          background: 'var(--accent-green)',
          color: '#0f172a',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
        }}>+ New Post</Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Published', value: stats.published, color: 'var(--accent-green)' },
          { label: 'Scheduled', value: stats.scheduled, color: 'var(--accent-blue)' },
          { label: 'Drafts', value: stats.draft, color: '#f59e0b' },
          { label: 'Timeline Events', value: stats.events, color: 'var(--accent-purple)' },
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

      {/* Admin nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        {[
          { label: '📝 Posts', href: '/admin/posts', active: true },
          { label: '📅 Timeline', href: '/admin/timeline' },
          { label: '📱 Apps', href: '/admin/apps' },
          { label: '📅 Schedule', href: '/admin/schedule' },
        ].map(nav => (
          <Link key={nav.label} href={nav.href} style={{
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            background: nav.active ? 'var(--bg-tertiary)' : 'transparent',
            color: nav.active ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}>
            {nav.label}
          </Link>
        ))}
      </div>

      {/* Posts table */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 12, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <span>Post</span>
          <span>Status</span>
          <span>Pillar</span>
          <span>Platforms</span>
          <span>Actions</span>
        </div>
        {posts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No posts yet. Connect Firebase or create your first post.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: 12,
              alignItems: 'center',
              fontSize: 13,
            }}>
              <div style={{ fontWeight: 500 }}>{post.title || post.content.substring(0, 60)}</div>
              <span style={{
                padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, width: 'fit-content',
                background: post.status === 'published' ? 'rgba(4,218,141,0.15)' : post.status === 'scheduled' ? 'rgba(0,133,255,0.15)' : 'rgba(245,158,11,0.15)',
                color: post.status === 'published' ? 'var(--accent-green)' : post.status === 'scheduled' ? 'var(--accent-blue)' : '#f59e0b',
              }}>
                {post.status}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{post.pillar || '—'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{post.platforms}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPage;
