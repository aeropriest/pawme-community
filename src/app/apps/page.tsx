import { getApps } from '@/lib/community-store';

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  active: { label: '🟢 Active', color: '#04DA8D' },
  beta: { label: '🔵 Beta', color: '#0085FF' },
  development: { label: '🟡 Development', color: '#f59e0b' },
  archived: { label: '⚪ Archived', color: '#64748b' },
};

async function AppsPage() {
  let apps: Awaited<ReturnType<typeof getApps>> = [];
  try {
    apps = await getApps();
  } catch {
    // Firebase not configured
  }

  const demoApps = apps.length === 0 ? [
    {
      id: 'app-1', name: 'PawMe', slug: 'pawme', tagline: 'AI Companion Robot',
      description: 'The main app for controlling and interacting with your PawMe robot. Features live camera feed, emotion controls, autonomous mode, and firmware updates.',
      logoUrl: '/apps/pawme-logo.png', screenshotUrls: [],
      features: ['Live camera feed', 'Emotion control', 'Autonomous pet mode', 'Firmware OTA updates', 'Voice commands'],
      techStack: ['Flutter', 'Firebase', 'ESP32', 'TensorFlow Lite'],
      appStoreUrl: '#', playStoreUrl: '#',
      status: 'active' as const, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-01T00:00:00Z',
    },
    {
      id: 'app-2', name: 'PawPilot', slug: 'pawpilot', tagline: 'Real-time robot control',
      description: 'Manual control app for PawMe — drive, tilt the head, trigger expressions, and stream the camera. Perfect for demos and testing.',
      logoUrl: '/apps/pawpilot-logo.png', screenshotUrls: [],
      features: ['Real-time driving', 'Head tilt control', 'Expression triggers', 'Camera streaming', 'Sensor dashboard'],
      techStack: ['React Native', 'WebRTC', 'MQTT'],
      githubUrl: 'https://github.com/ayvalabs',
      status: 'beta' as const, createdAt: '2025-08-01T00:00:00Z', updatedAt: '2026-04-01T00:00:00Z',
    },
  ] : apps;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>📱 Apps</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Control, customize, and connect with PawMe
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {demoApps.map(app => {
          const status = STATUS_STYLES[app.status] || STATUS_STYLES.development;
          return (
            <div key={app.id} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              transition: 'transform 0.2s',
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
                  width: 56, height: 56, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: '#0f172a',
                }}>
                  {app.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{app.name}</h3>
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
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{app.tagline}</p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {app.description}
                </p>

                {/* Features */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {app.features.map(f => (
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

                {/* Tech stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                  {app.techStack.map(t => (
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

                {/* Links */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {app.githubUrl && (
                    <a href={app.githubUrl} style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                      textDecoration: 'none',
                    }}>GitHub</a>
                  )}
                  {app.appStoreUrl && (
                    <a href={app.appStoreUrl} style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'rgba(4,218,141,0.1)', color: 'var(--accent-green)',
                      textDecoration: 'none',
                    }}>App Store</a>
                  )}
                  {app.playStoreUrl && (
                    <a href={app.playStoreUrl} style={{
                      flex: 1, textAlign: 'center', padding: '8px',
                      borderRadius: 8, fontSize: 13, fontWeight: 600,
                      background: 'rgba(0,133,255,0.1)', color: 'var(--accent-blue)',
                      textDecoration: 'none',
                    }}>Play Store</a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AppsPage;
