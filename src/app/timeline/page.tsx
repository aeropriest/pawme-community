import { getTimelineEvents } from '@/lib/community-store';

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

async function TimelinePage() {
  let events: Awaited<ReturnType<typeof getTimelineEvents>> = [];
  try {
    events = await getTimelineEvents({ limit: 50 });
  } catch {
    // Firebase not configured yet
  }

  const demoEvents = events.length === 0 ? [
    {
      id: 'tl-1', date: '2026-05-20', title: 'Community page development begins',
      description: 'Started building the PawMe Community site — a Reddit-style hub for sharing the entire build journey with the world.',
      category: 'software' as const, sourceType: 'dev_log' as const, createdAt: '2026-05-20T00:00:00Z',
    },
    {
      id: 'tl-2', date: '2026-04-15', title: 'Partnership: Auki Network announced 🤝',
      description: 'PawMe partners with Auki Network for decentralized spatial computing — giving PawMe awareness of its environment.',
      category: 'partnership' as const, sourceType: 'meeting_notes' as const, createdAt: '2026-04-15T00:00:00Z',
    },
    {
      id: 'tl-3', date: '2026-04-01', title: '$AYVA token launched on Base 🚀',
      description: 'Virtuals Protocol partnership brings the $AYVA token to the Base ecosystem, enabling community governance.',
      category: 'milestone' as const, sourceType: 'press' as const, createdAt: '2026-04-01T00:00:00Z',
    },
    {
      id: 'tl-4', date: '2026-03-20', title: 'Red Dot Award application submitted 🏆',
      description: 'Submitted PawMe for the Red Dot Design Award — a major milestone for the industrial design work by Ameya Mistry.',
      category: 'award' as const, sourceType: 'dev_log' as const, createdAt: '2026-03-20T00:00:00Z',
    },
    {
      id: 'tl-5', date: '2026-02-28', title: 'Kickstarter campaign prep begins',
      description: 'Started preparing for the March 2026 Kickstarter launch — campaign page, media assets, and early bird pricing.',
      category: 'milestone' as const, sourceType: 'meeting_notes' as const, createdAt: '2026-02-28T00:00:00Z',
    },
    {
      id: 'tl-6', date: '2026-02-10', title: 'Prototype v4: Camera + LED face working',
      description: 'Integrated ESP32-CAM with the LED matrix face. First time PawMe could &quot;see&quot; and express emotions simultaneously.',
      category: 'prototype' as const, sourceType: 'dev_log' as const, createdAt: '2026-02-10T00:00:00Z',
    },
    {
      id: 'tl-7', date: '2026-01-15', title: 'Industrial designer onboarded: Ameya Mistry 🎨',
      description: 'Brought on Amoya Mistry for industrial design — transforming the prototype into a consumer-ready product.',
      category: 'design' as const, sourceType: 'meeting_notes' as const, createdAt: '2026-01-15T00:00:00Z',
    },
    {
      id: 'tl-8', date: '2025-12-01', title: 'Patent filed for tilting head mechanism',
      description: 'Filed a provisional patent for the unique tilting head mechanism that gives PawMe its expressive personality.',
      category: 'milestone' as const, sourceType: 'dev_log' as const, createdAt: '2025-12-01T00:00:00Z',
    },
  ] : events;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>📅 Build Timeline</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          The complete journey of PawMe — from BB-8 inspired dream to AI companion robot
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 12,
          top: 0,
          bottom: 0,
          width: 3,
          background: 'linear-gradient(to bottom, var(--accent-green), var(--accent-blue), var(--accent-purple))',
          borderRadius: 2,
        }} />

        {demoEvents.map((event, index) => {
          const cat = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.milestone;
          return (
            <div key={event.id} style={{ position: 'relative', marginBottom: 24 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute',
                left: 6,
                top: 4,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: cat.color,
                border: `3px solid ${'var(--bg-primary)'}`,
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
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>{event.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {event.description}
                </p>
                {event.gitCommitUrl && (
                  <a href={event.gitCommitUrl} style={{ fontSize: 12, marginTop: 8, display: 'inline-block' }}>
                    View commit →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelinePage;
