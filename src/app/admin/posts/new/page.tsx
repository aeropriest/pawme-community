import Link from 'next/link';
import { generateDailyPosts } from '@/lib/gemini-content';

export const dynamic = 'force-dynamic';

async function NewPostPage() {
  // Try to generate AI suggestions
  let aiSuggestions: Array<{ pillar: string; title: string; content: string; tags: string[]; imagePrompt?: string }> = [];
  try {
    const sampleSources = [
      'Building an AI companion robot with ESP32, servo motors, and camera. Working on head tilt mechanism with IMU fusion.',
      'Joined Auki Network for decentralized spatial computing. Filed patent for tilting head mechanism.',
      'Launched $AYVA token on Base via Virtuals Protocol. Red Dot Award application submitted.',
    ];
    aiSuggestions = await generateDailyPosts(sampleSources, 3);
  } catch {
    // Gemini not configured
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Create New Post</h1>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--accent-blue)' }}>
            🤖 AI Suggestions (Click to use)
          </h2>
          {aiSuggestions.map((s, i) => (
            <div key={i} style={{
              background: 'var(--secondary)',
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontWeight: 600, marginBottom: 4 }}>{s.pillar}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.content.substring(0, 200)}...</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {s.tags.map(t => (
                  <span key={t} style={{ padding: '2px 8px', borderRadius: 8, background: 'var(--bg-tertiary)', fontSize: 11 }}>#{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual form */}
      <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Title</label>
          <input type="text" placeholder="Post title..." style={{
            width: '100%', padding: '12px 16px', borderRadius: 8,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: 14, outline: 'none',
          }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Content</label>
          <textarea rows={8} placeholder="Write your post content..." style={{
            width: '100%', padding: '12px 16px', borderRadius: 8,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical',
            fontFamily: 'inherit',
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Pillar</label>
            <select style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            }}>
              <option value="">Select pillar...</option>
              <option value="build_in_public">🔨 Build In Public</option>
              <option value="product_showcase">🚀 Product Showcase</option>
              <option value="founder_voice">🎤 Founder Voice</option>
              <option value="community_prompt">💬 Community Prompt</option>
              <option value="market_context">📊 Market Context</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Platforms</label>
            <select style={{
              width: '100%', padding: '12px 16px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            }}>
              <option value="both">X + Telegram</option>
              <option value="x">X Only</option>
              <option value="telegram">Telegram Only</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Schedule (optional - leave blank for now)</label>
          <input type="datetime-local" style={{
            width: '100%', padding: '12px 16px', borderRadius: 8,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: 14, outline: 'none',
          }} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" style={{
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700,
            background: 'var(--accent-green)', color: '#0f172a', border: 'none', cursor: 'pointer',
          }}>Save Draft</button>
          <button type="button" style={{
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: 'var(--accent-blue)', color: 'white', border: 'none', cursor: 'pointer',
          }}>Publish Now</button>
          <Link href="/admin/posts" style={{
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textDecoration: 'none',
          }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default NewPostPage;
