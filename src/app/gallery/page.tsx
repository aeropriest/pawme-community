import { SEED_POSTS } from '@/lib/seed-data';

// Extract all unique tags from posts
const allTags = new Set<string>();
SEED_POSTS.forEach(p => p.tags.forEach(t => allTags.add(t)));
const sortedTags = Array.from(allTags).sort();

// Source type labels
const SOURCE_LABELS: Record<string, string> = {
  whatsapp: '💬 WhatsApp',
  meeting_notes: '📋 Meeting Notes',
  dev_log: '📝 Dev Log',
  press: '📰 Press',
  community: '👥 Community',
  git_history: '💻 Git History',
};

export default function GalleryPage() {
  // Group posts by source type
  const bySource: Record<string, typeof SEED_POSTS> = {};
  for (const post of SEED_POSTS) {
    if (!bySource[post.sourceType]) bySource[post.sourceType] = [];
    bySource[post.sourceType].push(post);
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>🖼️ Content Gallery</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Browse all {SEED_POSTS.length} posts by tag, pillar, or source
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Total Posts', value: SEED_POSTS.length },
          { label: 'Tags', value: sortedTags.length },
          { label: 'Authors', value: new Set(SEED_POSTS.map(p => p.author)).size },
          { label: 'Sources', value: Object.keys(bySource).length },
          { label: 'Upvotes', value: SEED_POSTS.reduce((s, p) => s + p.upvotes, 0) },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-secondary)',
            borderRadius: 8,
            padding: '16px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-orange)' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tag cloud */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 8,
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        marginBottom: 32,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>🏷️ All Tags</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sortedTags.map((tag: string) => (
            <span key={tag} style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--accent-blue)',
              padding: '4px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Posts by source */}
      {Object.entries(bySource).map(([source, posts]) => (
        <div key={source} style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            margin: '0 0 16px',
            paddingBottom: 8,
            borderBottom: '1px solid var(--border-color)',
          }}>
            {SOURCE_LABELS[source] || source} ({posts.length} posts)
          </h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {posts.map(post => (
              <div key={post.id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: 8,
                padding: '12px 16px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {post.authorName} • {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--upvote-orange)' }}>▲ {post.upvotes}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>💬 {post.commentCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
