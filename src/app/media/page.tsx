import Link from 'next/link';
import { TIMELINE_DAYS } from '@/lib/timeline-data';

interface MediaItem {
  filename: string;
  type: string;
  day: number;
  date: string;
  title: string;
}

// Extract all media from timeline days
const allMedia: MediaItem[] = [];

for (const day of TIMELINE_DAYS) {
  for (let i = 0; i < day.mediaFiles.length; i++) {
    allMedia.push({
      filename: day.mediaFiles[i],
      type: day.mediaTypes[i] || 'image',
      day: day.dayNumber,
      date: day.date,
      title: day.title,
    });
  }
}

allMedia.sort((a, b) => a.day - b.day);

export default function MediaPage() {
  const images = allMedia.filter(m => m.type === 'image');
  const videos = allMedia.filter(m => m.type === 'video');

  // Group by day using Map
  const byDayMap = new Map<number, MediaItem[]>();
  for (const m of allMedia) {
    const existing = byDayMap.get(m.day) || [];
    existing.push(m);
    byDayMap.set(m.day, existing);
  }
  
  const byDayEntries = Array.from(byDayMap.entries()).sort(([a], [b]) => a - b);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link href="/timeline" style={{ fontSize: 13, color: 'var(--accent-blue)' }}>
          ← Back to Timeline
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '16px 0 8px' }}>🖼️ Build Media Gallery</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {allMedia.length} photos and videos from our WhatsApp build log
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, fontSize: 13 }}>
          <span>📷 {images.length} photos</span>
          <span>•</span>
          <span>🎥 {videos.length} videos</span>
          <span>•</span>
          <span>{byDayEntries.length} days with media</span>
        </div>
      </div>

      {/* Media grouped by day */}
      {byDayEntries.map(([dayNum, media]) => (
        <div key={dayNum} style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            margin: '0 0 12px',
            padding: '8px 16px',
            background: 'var(--bg-secondary)',
            borderRadius: 8,
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>
              <span style={{ color: 'var(--accent-orange)' }}>Day {dayNum}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
                {media[0]?.date}
              </span>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
              {media.length} file{media.length !== 1 ? 's' : ''}
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
          }}>
            {media.map((m, i) => {
              const fileUrl = `/media/${m.filename}`;
              return (
                <div key={i} style={{
                  aspectRatio: 1,
                  borderRadius: 8,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {m.type === 'video' ? (
                    <video
                      src={fileUrl}
                      controls
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', width: '100%', height: '100%' }}
                    >
                      <img
                        src={fileUrl}
                        alt={m.filename}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </a>
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.6)',
                    padding: '4px 6px',
                    fontSize: 8,
                    color: '#fff',
                    textAlign: 'center',
                    wordBreak: 'break-all',
                    pointerEvents: 'none',
                  }}>
                    {m.filename.split('-')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            margin: '8px 0 0',
            fontStyle: 'italic',
          }}>
            {media[0]?.title}
          </p>
        </div>
      ))}

      {/* Note */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 8,
        padding: '16px 20px',
        marginTop: 32,
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#f59e0b' }}>
          📁 Full-resolution media (355+ photos, 27+ videos) stored in Google Drive & WhatsApp archives.
          <br />
          Connect Firebase Storage to display full-resolution media here.
        </p>
      </div>
    </div>
  );
}
