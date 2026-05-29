import Link from 'next/link';
import { TIMELINE_DAYS, getMediaCount, getTotalDays } from '@/lib/timeline-data';

function daysAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function TimelinePage() {
  const sortedDays = [...TIMELINE_DAYS].sort((a, b) => a.dayNumber - b.dayNumber);
  const totalMedia = getMediaCount();
  const totalDays = getTotalDays();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          📅 Day-by-Day Build Timeline
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto 16px' }}>
          The complete journey of PawMe — from Day 0 to today. Every milestone, every conversation, every photo and video.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>{sortedDays.length} days</span>
          <span>•</span>
          <span>Day 0 → Day {totalDays}</span>
          <span>•</span>
          <span>{totalMedia} photos</span>
          <span>•</span>
          <span>Jul 2025 → Present</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/media" style={{
            padding: '8px 20px',
            borderRadius: 20,
            background: 'var(--bg-tertiary)',
            color: 'var(--accent-blue)',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            🖼️ View Media Gallery
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
        marginBottom: 40,
        padding: '20px',
        background: 'var(--bg-secondary)',
        borderRadius: 12,
        border: '1px solid var(--border-color)',
      }}>
        {[
          { label: 'Days', value: sortedDays.length, icon: '📅' },
          { label: 'Photos', value: totalMedia, icon: '📸' },
          { label: 'People', value: '8+', icon: '👥' },
          { label: 'Started', value: 'Jul 21', icon: '🚀' },
          { label: 'Journey', value: '8+ mo', icon: '🌍' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-orange)' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 40,
          top: 0,
          bottom: 0,
          width: 4,
          background: 'linear-gradient(to bottom, var(--accent-orange), var(--accent-green), var(--accent-blue), var(--accent-purple))',
          borderRadius: 2,
        }} />

        {sortedDays.map((day) => {
          const hasMedia = day.mediaFiles.length > 0;
          return (
            <div key={`day-${day.dayNumber}`} style={{ position: 'relative', marginBottom: 32, paddingLeft: 90 }}>
              {/* Day badge */}
              <div style={{
                position: 'absolute',
                left: 16,
                top: 0,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: hasMedia ? 'var(--accent-orange)' : 'var(--bg-tertiary)',
                border: '3px solid var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                fontSize: 11,
                fontWeight: 800,
                color: hasMedia ? '#fff' : 'var(--text-secondary)',
              }}>
                D{day.dayNumber}
              </div>

              {/* Date label */}
              <div style={{
                position: 'absolute',
                left: -10,
                top: 52,
                width: 90,
                textAlign: 'right',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.3,
              }}>
                {day.dateLabel.split(',')[0]}
              </div>

              {/* Card */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                padding: '20px 24px',
                border: hasMedia ? '1px solid rgba(255,69,0,0.3)' : '1px solid var(--border-color)',
              }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-orange)' }}>
                      Day {day.dayNumber}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• {daysAgo(day.date)}</span>
                    {hasMedia && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--accent-green)',
                        background: 'rgba(4,218,141,0.1)',
                        padding: '2px 8px',
                        borderRadius: 8,
                      }}>
                        📸 {day.mediaFiles.length}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{day.title}</h3>
                </div>

                <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                  {day.summary}
                </p>

                {hasMedia && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                    {day.mediaFiles.slice(0, 6).map((file, i) => (
                      <div key={i} style={{
                        width: 40, height: 40, borderRadius: 6,
                        background: 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, border: '1px solid var(--border-color)',
                      }}>
                        {day.mediaTypes[i] === 'video' ? '🎥' : '📷'}
                      </div>
                    ))}
                    {day.mediaFiles.length > 6 && (
                      <div style={{
                        width: 40, height: 40, borderRadius: 6,
                        background: 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 600,
                        color: 'var(--accent-orange)',
                        border: '1px solid var(--border-color)',
                      }}>
                        +{day.mediaFiles.length - 6}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {day.participants.map(p => (
                      <span key={p} style={{
                        fontSize: 11, color: 'var(--accent-blue)',
                        background: 'rgba(0,133,255,0.08)',
                        padding: '2px 8px', borderRadius: 8,
                      }}>
                        {p.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {day.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontSize: 10, color: 'var(--text-muted)' }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* End marker */}
        <div style={{ position: 'relative', paddingLeft: 90, paddingBottom: 20 }}>
          <div style={{
            position: 'absolute', left: 24, width: 32, height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🐾</div>
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px 24px',
            border: '1px solid var(--border-color)', textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--accent-orange)' }}>
              Day {totalDays} — And counting...
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
              The journey continues at pawme.ayvalabs.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
