import { getTimelineEvents } from '@/lib/community-store';
import { SEED_TIMELINE } from '@/lib/seed-data';

const CATEGORY_STYLES: Record<string, { icon: string; color: string; label: string }> = {
  prototype: { icon: '🔧', color: '#ff4500', label: 'Prototype' },
  design: { icon: '🎨', color: '#8E54E9', label: 'Design' },
  firmware: { icon: '⚡', color: '#f59e0b', label: 'Firmware' },
  software: { icon: '💻', color: '#0085FF', label: 'Software' },
  manufacturing: { icon: '🏭', color: '#64748b', label: 'Manufacturing' },
  media: { icon: '🎬', color: '#ec4899', label: 'Media' },
  partnership: { icon: '🤝', color: '#04DA8D', label: 'Partnership' },
  award: { icon: '🏆', color: '#eab308', label: 'Award' },
  milestone: { icon: '🎯', color: '#ef4444', label: 'Milestone' },
};

export default async function TimelinePage() {
  let events: Awaited<ReturnType<typeof getTimelineEvents>> = [];
  let usingFallback = false;
  
  try {
    events = await getTimelineEvents({ limit: 50 });
  } catch {
    events = [];
  }
  
  if (events.length === 0) {
    events = SEED_TIMELINE as any;
    usingFallback = true;
  }

  // Group by month
  const grouped: Record<string, typeof events> = {};
  for (const event of events) {
    const month = event.date.substring(0, 7); // YYYY-MM
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(event);
  }

  const monthNames: Record<string, string> = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December',
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>📅 Build Timeline</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          The complete journey of PawMe — from BB-8 inspired dream to AI companion robot
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          <span>{events.length} events</span>
          <span>•</span>
          <span>July 2025 → Present</span>
          <span>•</span>
          <span>8 countries</span>
        </div>
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

      {/* Category legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        {Object.entries(CATEGORY_STYLES).map(([key, val]) => {
          const count = events.filter(e => e.category === key).length;
          if (count === 0) return null;
          return (
            <span key={key} style={{
              background: `${val.color}15`,
              color: val.color,
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {val.icon} {val.label} ({count})
            </span>
          );
        })}
      </div>

      {/* Timeline grouped by month */}
      {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([monthKey, monthEvents]) => {
        const year = monthKey.substring(0, 4);
        const month = monthKey.substring(5, 7);
        const monthLabel = `${monthNames[month]} ${year}`;
        
        return (
          <div key={monthKey} style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              margin: '0 0 16px',
              padding: '8px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              {monthLabel}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                {monthEvents.length} events
              </span>
            </h2>

            <div style={{ position: 'relative', paddingLeft: 32 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: 12,
                top: 0,
                bottom: 0,
                width: 3,
                background: 'linear-gradient(to bottom, var(--accent-orange), var(--accent-green), var(--accent-blue))',
                borderRadius: 2,
              }} />

              {monthEvents.sort((a, b) => b.date.localeCompare(a.date)).map((event) => {
                const cat = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.milestone;
                return (
                  <div key={event.id} style={{ position: 'relative', marginBottom: 20 }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute',
                      left: 6,
                      top: 4,
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      background: cat.color,
                      border: `3px solid var(--bg-primary)`,
                      zIndex: 1,
                    }} />

                    {/* Card */}
                    <div style={{
                      marginLeft: 28,
                      background: 'var(--bg-secondary)',
                      borderRadius: 10,
                      padding: '16px 20px',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{
                          background: `${cat.color}20`,
                          color: cat.color,
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                        }}>
                          {cat.icon} {cat.label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        {event.sourceType && (
                          <span style={{
                            fontSize: 10,
                            color: 'var(--text-muted)',
                            background: 'var(--bg-tertiary)',
                            padding: '2px 6px',
                            borderRadius: 6,
                          }}>
                            {event.sourceType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>{event.title}</h3>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
