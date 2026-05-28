import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'PawMe Community | r/PawMeBot',
  description: 'The community hub for PawMe — an AI-powered wheeled companion robot. Build logs, timeline, apps, and more.',
  openGraph: {
    title: 'PawMe Community',
    description: 'Building the future of pet companions — one commit at a time.',
    siteName: 'PawMe Community',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawMe Community | r/PawMeBot',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <span style={{ fontSize: 28 }}>🐾</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>PawMe Community</span>
              </Link>
            </div>
            <nav style={{ display: 'flex', gap: 24 }}>
              <Link href="/feed" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Posts</Link>
              <Link href="/timeline" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Timeline</Link>
              <Link href="/apps" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Apps</Link>
            </nav>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/admin" style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                background: 'var(--accent-green)',
                color: '#0f172a',
                textDecoration: 'none',
              }}>
                Admin
              </Link>
            </div>
          </div>
        </header>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: 48, padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          <p>Built with ❤️ by Ayva Labs • <a href="https://pawmebot.com" style={{ color: 'var(--accent-blue)' }}>pawmebot.com</a></p>
          <p style={{ marginTop: 8 }}>Follow: <a href="https://x.com/pawme_ai" style={{ color: 'var(--accent-blue)' }}>@pawme_ai</a></p>
        </footer>
      </body>
    </html>
  );
}
