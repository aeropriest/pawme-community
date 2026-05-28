import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Overview', icon: '📊', href: '/admin' },
  { label: 'Posts', icon: '📝', href: '/admin/posts' },
  { label: 'Timeline', icon: '📅', href: '/admin/timeline' },
  { label: 'Apps', icon: '📱', href: '/admin/apps' },
  { label: 'Schedule', icon: '⏰', href: '/admin/schedule' },
  { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 24, minHeight: 'calc(100vh - 200px)' }}>
      {/* Admin sidebar */}
      <nav style={{
        width: 200,
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRadius: 10,
        border: '1px solid var(--border-color)',
        padding: 12,
        height: 'fit-content',
        position: 'sticky',
        top: 16,
      }}>
        <div style={{ padding: '8px 12px', marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 1 }}>
          Admin
        </div>
        {NAV_ITEMS.map(item => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            marginBottom: 2,
          }}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 12, paddingTop: 12 }}>
          <Link href="/feed" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 13,
            textDecoration: 'none',
            color: 'var(--text-secondary)',
          }}>
            ← Back to Community
          </Link>
        </div>
      </nav>

      {/* Admin content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
