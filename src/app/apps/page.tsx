import { getApps } from '@/lib/community-store';
import { SEED_APPS } from '@/lib/seed-data';

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  active: { label: '🟢 Active', color: '#04DA8D' },
  beta: { label: '🔵 Beta', color: '#0085FF' },
  development: { label: '🟡 Development', color: '#f59e0b' },
  archived: { label: '⚪ Archived', color: '#64748b' },
};

export default async function AppsPage() {
  let apps: Awaited<ReturnType<typeof getApps>> = [];
  let usingFallback = false;
  
  try {
    apps = await getApps();
  } catch {
    apps = [];
  }
  
  if (apps.length === 0) {
    apps = SEED_APPS as any;
    usingFallback = true;
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>📱 Apps</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
          Control, customize, and connect with PawMe. Our apps put the power of an AI companion robot in your pocket.
        </p>
        {usingFallback && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 8,
            padding: '8px 16px',
            marginTop: 16,
            fontSize: 13,
            color: '#f59e0b',
            display: 'inline-block',
          }}>
            ⚠️ Showing offline data. Connect Firebase for real-time updates.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 24 }}>
        {apps.map((app: any) => {
          const status = STATUS_STYLES[app.status] || STATUS_STYLES.development;
          return (
            <div key={app.id} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
            }}>
              {/* App header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(4,218,141,0.1), rgba(0,133,255,0.1))',
                padding: '24px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-green))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: '#0f172a',
                }}>
                  {app.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{app.name}</h3>
                    <span style={{
                      background: `${status.color}20`,
                      color: status.color,
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {status.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>{app.tagline}</p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {app.description}
                </p>

                {/* Features */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                    Features
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {app.features.slice(0, 6).map((f: string) => (
                      <span key={f} style={{
                        background: 'var(--bg-tertiary)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech stack */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                    Tech Stack
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {app.techStack.map((t: string) => (
                      <span key={t} style={{
                        background: 'rgba(0,133,255,0.1)',
                        color: 'var(--accent-blue)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 500,
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {app.githubUrl && (
                    <a href={app.githubUrl} target="_blank" rel="noopener" style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                      textDecoration: 'none', minWidth: 80,
                    }}>💻 GitHub</a>
                  )}
                  {app.websiteUrl && (
                    <a href={app.websiteUrl} target="_blank" rel="noopener" style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'rgba(4,218,141,0.1)', color: 'var(--accent-green)',
                      textDecoration: 'none', minWidth: 80,
                    }}>🌐 Website</a>
                  )}
                  {app.appStoreUrl && (
                    <a href={app.appStoreUrl} target="_blank" rel="noopener" style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'rgba(0,133,255,0.1)', color: 'var(--accent-blue)',
                      textDecoration: 'none', minWidth: 80,
                    }}>🍎 App Store</a>
                  )}
                  {app.playStoreUrl && (
                    <a href={app.playStoreUrl} target="_blank" rel="noopener" style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                      textDecoration: 'none', minWidth: 80,
                    }}>🤖 Play Store</a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Other Ayva Labs projects */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>🛠️ Other Ayva Labs Projects</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          More tools and experiments from the Ayva Labs team
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { name: 'PawMe Website', desc: 'Official website with admin dashboard, Stripe payments, and social media management.', tech: ['Next.js', 'Firebase', 'Stripe'], url: 'https://github.com/ayvalabs/pawme_website' },
            { name: 'ESP32 Camera Ball', desc: 'Open-source ESP32-S3 spherical robot with camera, sensors, voice Q&A, PCB notes, and 3D files.', tech: ['ESP32', 'Arduino', 'OpenAI'], url: 'https://github.com/ayvalabs/esp32-camera-ball-with-gpt' },
            { name: 'AI Marketing Agent', desc: 'Telegram-based marketing agent for automated content and community management.', tech: ['Python', 'Telegram', 'AI'], url: 'https://github.com/ayvalabs/ai-marketing-agent' },
            { name: 'Gemini Forge', desc: 'Experimental project exploring Gemini AI capabilities for content generation.', tech: ['Python', 'Gemini'], url: 'https://github.com/ayvalabs/ayvalabs-Gemini-Forge' },
            { name: 'Annapurna', desc: 'Food recipes app for pets and humans — because good nutrition matters for everyone.', tech: ['Flutter', 'Firebase'], url: 'https://github.com/ayvalabs/annapurna' },
          ].map(project => (
            <a key={project.name} href={project.url} target="_blank" rel="noopener" style={{
              background: 'var(--bg-secondary)',
              borderRadius: 10,
              padding: '16px 20px',
              border: '1px solid var(--border-color)',
              textDecoration: 'none',
              display: 'block',
            }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{project.name}</h3>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{project.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {project.tech.map(t => (
                  <span key={t} style={{
                    background: 'rgba(0,133,255,0.1)',
                    color: 'var(--accent-blue)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 500,
                  }}>{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
