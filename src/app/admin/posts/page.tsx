import { getCommunityPosts } from '@/lib/community-store';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function PostsAdminPage() {
  let posts: any[] = [];
  try {
    posts = await getCommunityPosts({ limit: 50, status: 'all' });
  } catch {
    // Firebase not configured
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Posts</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/posts/new" style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--accent-green)', color: '#0f172a', textDecoration: 'none',
          }}>+ New Post</Link>
          <button style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--accent-blue)', color: 'white', border: 'none', cursor: 'pointer',
          }}>🤖 Generate AI Posts</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {['all', 'published', 'scheduled', 'draft', 'failed'].map(f => (
          <button key={f} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: f === 'all' ? 'var(--bg-tertiary)' : 'transparent',
            border: '1px solid var(--border-color)',
            color: f === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            textTransform: 'capitalize',
          }}>{f} ({f === 'all' ? posts.length : posts.filter(p => p.status === f).length})</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 120px 80px', gap: 12, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Title / Content</span>
          <span>Status</span>
          <span>Pillar</span>
          <span>Platform</span>
          <span>Date</span>
          <span></span>
        </div>
        {posts.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No posts yet</p>
            <p style={{ fontSize: 13 }}>Connect Firebase to see posts, or create your first post manually.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} style={{
              padding: '12px 16px', borderBottom: '1px solid var(--border-color)',
              display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 120px 80px',
              gap: 12, alignItems: 'center', fontSize: 13,
            }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{post.title || '(no title)'}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.content.substring(0, 80)}...
                </div>
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, width: 'fit-content',
                background: post.status === 'published' ? 'rgba(4,218,141,0.15)' : post.status === 'scheduled' ? 'rgba(0,133,255,0.15)' : 'rgba(245,158,11,0.15)',
                color: post.status === 'published' ? 'var(--accent-green)' : post.status === 'scheduled' ? 'var(--accent-blue)' : '#f59e0b',
              }}>{post.status}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{post.pillar || '—'}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{post.platforms}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>✏️</button>
                {post.status === 'draft' && (
                  <button style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(4,218,141,0.15)', border: 'none', cursor: 'pointer', color: 'var(--accent-green)' }}>✅</button>
                )}
                <button style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostsAdminPage;
