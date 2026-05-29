'use client';

import { useState } from 'react';

interface SocialPostCardProps {
  post: any;
  platformStatus: Array<{ name: string; key: string; configured: boolean; envVar: string }>;
}

const PLATFORM_ICONS: Record<string, string> = {
  x: '🐦', ig: '📸', tt: '🎵', fb: '👤', yt: '▶️', reddit: '🤖',
};

const PLATFORM_COLORS: Record<string, string> = {
  x: '#1DA1F2', ig: '#E4405F', tt: '#000000', fb: '#1877F2', yt: '#FF0000', reddit: '#FF4500',
};

export default function SocialPostCard({ post, platformStatus }: SocialPostCardProps) {
  const [posting, setPosting] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handlePost = async (platform: string) => {
    setPosting(prev => ({ ...prev, [platform]: true }));
    
    console.log(`[Social Post] Posting to ${platform}:`, {
      postId: post.id,
      title: post.title,
      content: post.content.substring(0, 100),
      mediaCount: post.imageUrls?.length || 0,
      tags: post.tags,
    });

    try {
      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          platform,
          text: post.title ? `${post.title}\n\n${post.content}` : post.content,
          title: post.title,
          tags: post.tags,
          mediaUrls: post.imageUrls || [],
        }),
      });

      const data = await response.json();
      console.log(`[Social Post] ${platform} result:`, data);
      
      setResults(prev => ({
        ...prev,
        [platform]: {
          success: data.success,
          message: data.success ? `Posted! ID: ${data.postId}` : (data.error || 'Failed'),
        }
      }));
    } catch (error) {
      console.error(`[Social Post] ${platform} error:`, error);
      setResults(prev => ({
        ...prev,
        [platform]: { success: false, message: 'Network error' },
      }));
    } finally {
      setPosting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handlePostToAll = async () => {
    const configured = platformStatus.filter(p => p.configured).map(p => p.key);
    console.log('[Social Post] Posting to all configured platforms:', configured);
    
    for (const platform of configured) {
      await handlePost(platform);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 20px',
      border: '1px solid var(--border-color)',
    }}>
      {/* Post content */}
      <div style={{ marginBottom: 12 }}>
        <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>{post.title}</h4>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {post.content.substring(0, 250)}{post.content.length > 250 ? '...' : ''}
        </p>
        
        {/* Tags */}
        {post.tags && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
            {post.tags.slice(0, 5).map((tag: string) => (
              <span key={tag} style={{
                fontSize: 11, color: 'var(--accent-blue)',
                background: 'rgba(0,133,255,0.08)',
                padding: '2px 8px', borderRadius: 8,
              }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
          <span>u/{post.authorName}</span>
          <span>▲ {post.upvotes}</span>
          <span>💬 {post.commentCount}</span>
          <span style={{
            padding: '1px 6px', borderRadius: 4,
            background: 'var(--bg-tertiary)',
          }}>
            {post.pillar?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Social buttons */}
      <div style={{
        display: 'flex', gap: 6, padding: '12px 0 0',
        borderTop: '1px solid var(--border-color)',
        alignItems: 'center', flexWrap: 'wrap',
      }}>
        {platformStatus.map(p => {
          const isPosting = posting[p.key];
          const result = results[p.key];
          
          return (
            <button
              key={p.key}
              onClick={() => p.configured && handlePost(p.key)}
              disabled={!p.configured || isPosting}
              title={p.configured ? `Post to ${p.name}` : `Configure: ${p.envVar.split(',')[0]}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 600,
                background: result?.success ? 'rgba(4,218,141,0.15)' : 
                           result ? 'rgba(239,68,68,0.1)' :
                           p.configured ? `${PLATFORM_COLORS[p.key]}15` : 'var(--bg-tertiary)',
                color: result?.success ? 'var(--accent-green)' :
                       result ? '#ef4444' :
                       p.configured ? PLATFORM_COLORS[p.key] : 'var(--text-muted)',
                border: `1px solid ${result ? (result.success ? 'var(--accent-green)' : '#ef4444') : p.configured ? PLATFORM_COLORS[p.key] + '40' : 'var(--border-color)'}`,
                cursor: p.configured ? 'pointer' : 'not-allowed',
                opacity: p.configured ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              <span>{PLATFORM_ICONS[p.key]}</span>
              <span>{isPosting ? '...' : result?.success ? '✓' : result ? '✗' : p.name.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* Post to All */}
        <button
          onClick={handlePostToAll}
          disabled={!platformStatus.some(p => p.configured)}
          style={{
            marginLeft: 'auto',
            padding: '6px 16px', borderRadius: 20,
            fontSize: 12, fontWeight: 700,
            background: 'var(--accent-orange)', color: '#fff',
            border: 'none', cursor: 'pointer',
            opacity: platformStatus.some(p => p.configured) ? 1 : 0.5,
          }}
        >
          ⚡ Post to All
        </button>
      </div>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(results).map(([platform, result]) => (
            <span key={platform} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 6,
              background: result.success ? 'rgba(4,218,141,0.1)' : 'rgba(239,68,68,0.1)',
              color: result.success ? 'var(--accent-green)' : '#ef4444',
            }}>
              {PLATFORM_ICONS[platform]} {platform}: {result.message}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
