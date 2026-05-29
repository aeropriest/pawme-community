import { readFileSync } from 'fs';
import { join } from 'path';

// Read generated timeline at build time
let timelineData: any = { entries: [] };
try {
  const raw = readFileSync(join(process.cwd(), 'src/lib/generated-timeline.json'), 'utf-8');
  timelineData = JSON.parse(raw);
} catch {
  // Fallback if not generated yet
}

function daysAgo(dateStr: string): string {
  try {
    const [d, m, y] = dateStr.split('/').map(Number);
    const diff = Date.now() - new Date(y, m - 1, d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch { return ''; }
}

const PILLAR_COLORS: Record<string, string> = {
  build_in_public: '#ff4500',
  product_showcase: '#04DA8D',
  founder_voice: '#8E54E9',
  design: '#ec4899',
  media: '#f59e0b',
  manufacturing: '#64748b',
  firmware: '#06b6d4',
  software: '#3b82f6',
  milestone: '#eab308',
  market_context: '#10b981',
};

export default function TimelinePage() {
  const entries = timelineData.entries || [];
  const studioVideos = timelineData.studioVideos || [];
  
  // Group by month
  const byMonth: Record<string, typeof entries> = {};
  for (const e of entries) {
    const [d, m, y] = e.date.split('/').map(Number);
    const monthKey = `${y}-${String(m).padStart(2, '0')}`;
    if (!byMonth[monthKey]) byMonth[monthKey] = [];
    byMonth[monthKey].push(e);
  }
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const sortedMonths = Object.keys(byMonth).sort();

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>
          📅 Day-by-Day Build Timeline
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 600, margin: '0 auto 16px' }}>
          {entries.length} days • {timelineData.totalMedia || 0} photos/videos • Day 0 to Day {entries.length > 0 ? entries[entries.length - 1].dayNumber : 0}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          <span>📅 Jul 21, 2025 → Present</span>
          <span>•</span>
          <span>👥 10+ participants</span>
          <span>•</span>
          <span>🎥 {studioVideos.length} studio videos</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 32,
        padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)',
      }}>
        {[
          { label: 'Days', value: entries.length, icon: '📅' },
          { label: 'Photos', value: timelineData.totalMedia || 0, icon: '📸' },
          { label: 'Messages', value: timelineData.totalMessages || 0, icon: '💬' },
          { label: 'With Media', value: timelineData.mediaDates || 0, icon: '🎥' },
          { label: 'Countries', value: 8, icon: '🌍' },
          { label: 'Team', value: '10+', icon: '👥' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-orange)' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Studio videos section */}
      {studioVideos.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>
            🎬 Studio Videos ({studioVideos.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {studioVideos.slice(0, 20).map((video: string) => (
              <div key={video} style={{
                background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 16px',
                border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>🎬</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{video.replace(/^\d+_\s*/, '').replace('.mp4', '').replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Studio production</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline by month */}
      {sortedMonths.map(monthKey => {
        const [y, m] = monthKey.split('-').map(Number);
        const monthLabel = `${monthNames[m - 1]} ${y}`;
        const monthEntries = byMonth[monthKey];
        const monthMedia = monthEntries.reduce((s: number, e: any) => s + e.mediaCount, 0);
        
        return (
          <div key={monthKey} style={{ marginBottom: 40 }}>
            {/* Month header */}
            <h2 style={{
              fontSize: 20, fontWeight: 700, margin: '0 0 16px',
              padding: '10px 20px', background: 'var(--bg-secondary)',
              borderRadius: 10, border: '1px solid var(--border-color)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'sticky', top: 0, zIndex: 10,
            }}>
              <span>{monthLabel}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
                {monthEntries.length} days • {monthMedia} photos/videos
              </span>
            </h2>

            {/* Day entries */}
            <div style={{ position: 'relative', paddingLeft: 60 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 28, top: 0, bottom: 0, width: 3,
                background: 'linear-gradient(to bottom, var(--accent-orange), var(--accent-green), var(--accent-blue))',
                borderRadius: 2,
              }} />

              {monthEntries.sort((a: any, b: any) => b.dayNumber - a.dayNumber).map((day: any) => {
                const pColor = PILLAR_COLORS[day.pillar] || '#64748b';
                return (
                  <div key={`day-${day.dayNumber}`} style={{
                    position: 'relative', marginBottom: 20,
                  }}>
                    {/* Day dot */}
                    <div style={{
                      position: 'absolute', left: 14, top: 16,
                      width: day.hasMedia ? 32 : 24, height: day.hasMedia ? 32 : 24,
                      borderRadius: '50%',
                      background: day.hasMedia ? pColor : 'var(--bg-tertiary)',
                      border: `3px solid var(--bg-primary)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 1, fontSize: day.hasMedia ? 10 : 9,
                      fontWeight: 800, color: day.hasMedia ? '#fff' : 'var(--text-secondary)',
                    }}>
                      D{day.dayNumber}
                    </div>

                    {/* Card */}
                    <div style={{
                      marginLeft: 52, background: 'var(--bg-secondary)',
                      borderRadius: 10, padding: '16px 20px',
                      border: day.hasMedia ? '1px solid rgba(255,69,0,0.2)' : '1px solid var(--border-color)',
                      borderLeft: `3px solid ${pColor}`,
                    }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: pColor }}>
                          Day {day.dayNumber}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {day.dateLabel}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {daysAgo(day.date)}</span>
                        {day.hasMedia && (
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: 'var(--accent-green)',
                            background: 'rgba(4,218,141,0.1)',
                            padding: '2px 8px', borderRadius: 8,
                          }}>
                            📸 {day.mediaCount}
                          </span>
                        )}
                      </div>

                      {/* Summary */}
                      <p style={{
                        margin: '0 0 10px', fontSize: 14, lineHeight: 1.7,
                        color: 'var(--text-secondary)', whiteSpace: 'pre-line',
                      }}>
                        {day.summary}
                      </p>

                      {/* Media file list */}
                      {day.hasMedia && day.mediaFiles.length > 0 && (
                        <div style={{
                          display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8,
                        }}>
                          {day.mediaFiles.slice(0, 6).map((mf: any, i: number) => (
                            <span key={i} style={{
                              fontSize: 11, padding: '3px 8px',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 6, color: 'var(--text-secondary)',
                              border: '1px solid var(--border-color)',
                            }}>
                              {mf.type === 'video' ? '🎥' : mf.type === 'pdf' ? '📄' : '📷'} {mf.file.substring(0, 25)}...
                            </span>
                          ))}
                          {day.mediaFiles.length > 6 && (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 0' }}>
                              +{day.mediaFiles.length - 6} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Participants */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {day.participants.slice(0, 5).map((p: string) => (
                          <span key={p} style={{
                            fontSize: 10, color: 'var(--accent-blue)',
                            background: 'rgba(0,133,255,0.08)',
                            padding: '2px 8px', borderRadius: 8,
                          }}>
                            {p.replace(/~ /, '').split(' ')[0]}
                          </span>
                        ))}
                        {day.participants.length > 5 && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{day.participants.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* End */}
      <div style={{ textAlign: 'center', padding: '20px 0 40px', color: 'var(--text-muted)', fontSize: 14 }}>
        🐾 Day {entries.length > 0 ? entries[entries.length - 1].dayNumber : 0} — The journey continues at pawme.ayvalabs.com
      </div>
    </div>
  );
}
