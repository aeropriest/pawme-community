import { getCommunityPosts } from '@/lib/community-store';
import { SEED_POSTS } from '@/lib/seed-data';

const PILLAR_LABELS: Record<string, { label: string; color: string }> = {
  build_in_public: { label: '🔨 Build In Public', color: '#ff4500' },
  product_showcase: { label: '🚀 Product', color: '#04DA8D' },
  founder_voice: { label: '🎤 Founder', color: '#8E54E9' },
  community_prompt: { label: '💬 Community', color: '#0085FF' },
  market_context: { label: '📊 Market', color: '#f59e0b' },
  design: { label: '🎨 Design', color: '#ec4899' },
  media: { label: '🎬 Media', color: '#f59e0b' },
  manufacturing: { label: '🏭 Manufacturing', color: '#64748b' },
  firmware: { label: '⚡ Firmware', color: '#06b6d4' },
  software: { label: '💻 Software', color: '#3b82f6' },
  milestone: { label: '🎯 Milestone', color: '#eab308' },
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
  } catch { return 'recently'; }
}

export default async function FeedPage() {
  let posts: any[] = [];
  let usingFallback = false;
  try {
    posts = await getCommunityPosts({ limit: 25 });
  } catch { posts = []; }
  if (posts.length === 0) { posts = SEED_POSTS; usingFallback = true; }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
      <div>
        {usingFallback && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#f59e0b' }}>
            ⚠️ Offline mode. Connect Firebase for real-time data. Media served from local Google Drive.
          </div>
        )}

        {/* Sort bar */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 16, marginBottom: 16, border: '1px solid var(--border-color)' }}>
          {[{k:'hot',l:'🔥 Hot'},{k:'new',l:'✨ New'},{k:'top',l:'📈 Top'}].map(s => (
            <button key={s.k} style={{ background: s.k==='hot'?'var(--bg-tertiary)':'transparent', border:'none', color: s.k==='hot'?'var(--text-primary)':'var(--text-secondary)', padding:'6px 12px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer' }}>{s.l}</button>
          ))}
        </div>

        {/* Posts */}
        {posts.map((post: any) => {
          const mediaFiles = post.imageUrls || post.mediaFiles || [];
          const hasMedia = mediaFiles.length > 0;
          
          return (
            <article key={post.id} style={{
              background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 12,
              border: '1px solid var(--border-color)', overflow: 'hidden',
            }}>
              <div style={{ display: 'flex' }}>
                {/* Upvote */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--text-secondary)"><path d="M10 3l7 10H3L10 3z" /></svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{post.upvotes}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--text-secondary)"><path d="M10 17l-7-10h14l-7 10z" /></svg>
                </div>

                {/* Content */}
                <div style={{ padding: '12px 16px', flex: 1 }}>
                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {post.pillar && PILLAR_LABELS[post.pillar] && (
                      <span style={{ background: PILLAR_LABELS[post.pillar].color+'20', color: PILLAR_LABELS[post.pillar].color, padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>
                        {PILLAR_LABELS[post.pillar].label}
                      </span>
                    )}
                    <span>u/{post.author === 'ashok' ? 'ashokjaiswal' : post.authorName?.toLowerCase().replace(' ','_') || post.author}</span>
                    <span>•</span>
                    <span>{timeAgo(post.createdAt)}</span>
                    {hasMedia && <span style={{ color: 'var(--accent-green)' }}>• 📸 {mediaFiles.length}</span>}
                  </div>

                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{post.title}</h3>

                  <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                    {post.content.substring(0, 400)}{post.content.length > 400 ? '...' : ''}
                  </p>

                  {/* Media thumbnails */}
                  {hasMedia && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                      {mediaFiles.slice(0, 4).map((mf: any, i: number) => {
                        const file = typeof mf === 'string' ? mf : mf.file;
                        const isVideo = file.endsWith('.mp4') || file.endsWith('.mov');
                        const url = `/api/media?file=${encodeURIComponent(file)}`;
                        return (
                          <a key={i} href={url} target="_blank" style={{
                            width: 80, height: 80, borderRadius: 6, overflow: 'hidden',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textDecoration: 'none', position: 'relative', flexShrink: 0,
                          }}>
                            {isVideo ? <span style={{ fontSize: 24 }}>🎬</span> : (
                              <img src={url} alt={file} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                              />
                            )}
                          </a>
                        );
                      })}
                      {mediaFiles.length > 4 && (
                        <div style={{ width: 80, height: 80, borderRadius: 6, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--accent-orange)', border: '1px solid var(--border-color)' }}>
                          +{mediaFiles.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                      {post.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Social sharing buttons */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 4 }}>Share:</span>
                    {[
                      { key: 'x', icon: '🐦', label: 'X', color: '#1DA1F2' },
                      { key: 'ig', icon: '📸', label: 'IG', color: '#E4405F' },
                      { key: 'tt', icon: '🎵', label: 'TT', color: '#000' },
                      { key: 'fb', icon: '👤', label: 'FB', color: '#1877F2' },
                      { key: 'yt', icon: '▶️', label: 'YT', color: '#FF0000' },
                      { key: 'reddit', icon: '🤖', label: 'Reddit', color: '#FF4500' },
                    ].map(platform => (
                      <a
                        key={platform.key}
                        href={`/admin/social?post=${post.id}&platform=${platform.key}`}
                        title={`Post to ${platform.label}`}
                        style={{
                          padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                          background: platform.color + '15', color: platform.color,
                          border: `1px solid ${platform.color}30`,
                          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
                        }}
                      >
                        {platform.icon} {platform.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sidebar - same as before */}
      <Sidebar posts={posts} />
    </div>
  );
}

function Sidebar({ posts }: { posts: any[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-green))', height: 60 }} />
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>🐾 r/PawMeBot</h3>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            The official community for PawMe — an open-source AI-powered wheeled companion robot for pets.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="/admin/social" style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: 'var(--accent-orange)', color: '#fff', textDecoration: 'none',
            }}>📱 Social Center</a>
            <a href="/timeline" style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textDecoration: 'none',
            }}>📅 Timeline</a>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)', padding: 16 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>📊 By the Numbers</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
          {[
            ['Build photos', '355+'],
            ['Dev videos', '27+'],
            ['WhatsApp days', '157'],
            ['Countries', '8'],
            ['Team members', '10+'],
            ['Patents filed', '1'],
            ['Apps released', '2'],
            ['Studio videos', '52'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)', padding: 16 }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>🔗 Links</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="https://pawmebot.com" style={{ fontSize: 13 }}>🌐 pawmebot.com</a>
          <a href="https://x.com/pawme_ai" style={{ fontSize: 13 }}>🐦 @pawme_ai</a>
          <a href="https://github.com/ayvalabs" style={{ fontSize: 13 }}>💻 GitHub (ayvalabs)</a>
          <a href="/timeline" style={{ fontSize: 13 }}>📅 Full Timeline</a>
          <a href="/admin/social" style={{ fontSize: 13 }}>📱 Social Center</a>
        </div>
      </div>
    </div>
  );
}
