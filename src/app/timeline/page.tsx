import { readFileSync } from 'fs';
import { join } from 'path';

// Read generated timeline at build time
let timelineData: any = { entries: [] };
try {
  const raw = readFileSync(join(process.cwd(), 'src/lib/generated-timeline.json'), 'utf-8');
  timelineData = JSON.parse(raw);
} catch {}

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
  build_in_public: '#ff4500', product_showcase: '#04DA8D', founder_voice: '#8E54E9',
  design: '#ec4899', media: '#f59e0b', manufacturing: '#64748b', firmware: '#06b6d4',
  software: '#3b82f6', milestone: '#eab308', market_context: '#10b981', prototype: '#8b5cf6',
};

export default function TimelinePage() {
  const entries = timelineData.entries || [];
  const studioVideos = timelineData.studioVideos || [];

  const byMonth: Record<string, typeof entries> = {};
  for (const e of entries) {
    const [d, m, y] = e.date.split('/').map(Number);
    const mk = `${y}-${String(m).padStart(2, '0')}`;
    if (!byMonth[mk]) byMonth[mk] = [];
    byMonth[mk].push(e);
  }

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const sortedMonths = Object.keys(byMonth).sort();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>📅 Day-by-Day Build Timeline</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {entries.length} days • {timelineData.totalMedia || 0} photos/videos • Day 0 → Day {entries[entries.length-1]?.dayNumber || 0}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:32, padding:'16px 20px', background:'var(--bg-secondary)', borderRadius:10, border:'1px solid var(--border-color)' }}>
        {[
          {label:'Days', value:entries.length, icon:'📅'},
          {label:'Photos', value:timelineData.totalMedia||0, icon:'📸'},
          {label:'Messages', value:timelineData.totalMessages||0, icon:'💬'},
          {label:'With Media', value:timelineData.mediaDates||0, icon:'🎥'},
          {label:'Countries', value:8, icon:'🌍'},
          {label:'Team', value:'10+', icon:'👥'},
        ].map(s => (
          <div key={s.label} style={{textAlign:'center'}}>
            <div style={{fontSize:20}}>{s.icon}</div>
            <div style={{fontSize:18, fontWeight:800, color:'var(--accent-orange)'}}>{s.value}</div>
            <div style={{fontSize:10, color:'var(--text-muted)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {sortedMonths.map(mk => {
        const [y, m] = mk.split('-').map(Number);
        const monthLabel = `${monthNames[m-1]} ${y}`;
        const monthEntries = byMonth[mk];
        const monthMedia = monthEntries.reduce((s: number, e: any) => s + (e.mediaCount || 0), 0);

        return (
          <div key={mk} style={{marginBottom:40}}>
            <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 16px', padding:'10px 20px', background:'var(--bg-secondary)', borderRadius:8, border:'1px solid var(--border-color)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>{monthLabel}</span>
              <span style={{fontSize:13, color:'var(--text-muted)', fontWeight:400}}>{monthEntries.length} days • {monthMedia} photos</span>
            </h2>

            <div style={{position:'relative', paddingLeft:50}}>
              <div style={{position:'absolute', left:22, top:0, bottom:0, width:3, background:'linear-gradient(to bottom, var(--accent-orange), var(--accent-green), var(--accent-blue))', borderRadius:2}} />

              {monthEntries.sort((a:any,b:any) => b.dayNumber - a.dayNumber).map((day:any) => {
                const pColor = PILLAR_COLORS[day.pillar] || '#64748b';
                const mediaFiles = day.mediaFiles || [];
                
                return (
                  <div key={`day-${day.dayNumber}`} style={{position:'relative', marginBottom:16}}>
                    {/* Day badge */}
                    <div style={{
                      position:'absolute', left:8, top:12,
                      width:mediaFiles.length > 0 ? 36 : 28, height:mediaFiles.length > 0 ? 36 : 28,
                      borderRadius:'50%', background:mediaFiles.length > 0 ? pColor : 'var(--bg-tertiary)',
                      border:'3px solid var(--bg-primary)', display:'flex', alignItems:'center', justifyContent:'center',
                      zIndex:1, fontSize:mediaFiles.length > 0 ? 10 : 9, fontWeight:800,
                      color:mediaFiles.length > 0 ? '#fff' : 'var(--text-secondary)',
                    }}>
                      D{day.dayNumber}
                    </div>

                    {/* Card */}
                    <div style={{
                      marginLeft:48, background:'var(--bg-secondary)', borderRadius:10, padding:'14px 18px',
                      border:`1px solid ${mediaFiles.length > 0 ? pColor + '30' : 'var(--border-color'}`,
                      borderLeft:`3px solid ${pColor}`,
                    }}>
                      {/* Header */}
                      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap'}}>
                        <span style={{fontSize:11, fontWeight:700, color:pColor}}>Day {day.dayNumber}</span>
                        <span style={{fontSize:11, color:'var(--text-muted)'}}>• {day.dateLabel} • {daysAgo(day.date)}</span>
                        {mediaFiles.length > 0 && (
                          <span style={{fontSize:10, fontWeight:600, color:'var(--accent-green)', background:'rgba(4,218,141,0.1)', padding:'2px 8px', borderRadius:8}}>
                            📸 {mediaFiles.length}
                          </span>
                        )}
                      </div>

                      {/* Summary */}
                      <p style={{margin:'0 0 10px', fontSize:13, lineHeight:1.7, color:'var(--text-secondary)', whiteSpace:'pre-line'}}>
                        {day.summary}
                      </p>

                      {/* Media thumbnails */}
                      {mediaFiles.length > 0 && (
                        <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:8}}>
                          {mediaFiles.slice(0, 8).map((mf:any, i:number) => {
                            const isVideo = mf.type === 'video' || mf.file.endsWith('.mp4') || mf.file.endsWith('.mov');
                            const mediaUrl = `/api/media?file=${encodeURIComponent(mf.file)}`;
                            
                            return (
                              <a key={i} href={mediaUrl} target="_blank" rel="noopener" style={{
                                width:64, height:64, borderRadius:6, overflow:'hidden',
                                background:'var(--bg-tertiary)', border:'1px solid var(--border-color)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                textDecoration:'none', position:'relative', flexShrink:0,
                              }}>
                                {isVideo ? (
                                  <span style={{fontSize:20}}>🎬</span>
                                ) : (
                                  <img
                                    src={mediaUrl}
                                    alt={mf.file}
                                    style={{width:'100%', height:'100%', objectFit:'cover'}}
                                    loading="lazy"
                                  />
                                )}
                                {isVideo && (
                                  <span style={{
                                    position:'absolute', bottom:2, right:2,
                                    background:'rgba(0,0,0,0.7)', color:'#fff',
                                    fontSize:8, padding:'1px 4px', borderRadius:3,
                                  }}>▶</span>
                                )}
                              </a>
                            );
                          })}
                          {mediaFiles.length > 8 && (
                            <div style={{
                              width:64, height:64, borderRadius:6, background:'var(--bg-tertiary)',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:11, fontWeight:600, color:'var(--accent-orange)',
                              border:'1px solid var(--border-color)',
                            }}>
                              +{mediaFiles.length - 8}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Participants */}
                      <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                        {day.participants?.slice(0,5).map((p:string) => (
                          <span key={p} style={{fontSize:10, color:'var(--accent-blue)', background:'rgba(0,133,255,0.08)', padding:'2px 8px', borderRadius:8}}>
                            {p.replace(/~ /,'').split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Studio videos */}
      {studioVideos.length > 0 && (
        <div style={{marginBottom:40}}>
          <h2 style={{fontSize:20, fontWeight:700, margin:'0 0 16px'}}>🎬 Studio Videos ({studioVideos.length})</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:12}}>
            {studioVideos.map((video:string) => {
              const title = video.replace(/^\d+[_-]\s*/,'').replace('.mp4','').replace(/[_-]/g,' ');
              const videoUrl = `/api/media?file=studio/${video}`;
              return (
                <div key={video} style={{
                  background:'var(--bg-secondary)', borderRadius:10, overflow:'hidden',
                  border:'1px solid var(--border-color)',
                }}>
                  <video
                    src={videoUrl}
                    controls
                    preload="metadata"
                    style={{width:'100%', height:180, objectFit:'cover', background:'#000'}}
                  />
                  <div style={{padding:'10px 14px'}}>
                    <div style={{fontSize:13, fontWeight:600}}>{title}</div>
                    <div style={{fontSize:11, color:'var(--text-muted)'}}>Studio production video</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{textAlign:'center', padding:'20px 0 40px', color:'var(--text-muted)', fontSize:14}}>
        🐾 Day {entries[entries.length-1]?.dayNumber || 0} — The journey continues
      </div>
    </div>
  );
}
