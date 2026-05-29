import { NextRequest, NextResponse } from 'next/server';
import { postToAll, type PostContent } from '@/lib/social-publisher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, platform, text, title, tags, mediaUrls } = body;

    console.log('[API] Social post request:', { postId, platform, textLength: text?.length, mediaCount: mediaUrls?.length });

    const content: PostContent = {
      text: text || '',
      title: title || '',
      tags: tags || [],
      mediaUrls: mediaUrls || [],
    };

    let results;

    if (platform === 'all') {
      // Post to all configured platforms
      const platforms = ['x', 'ig', 'tt', 'fb', 'yt', 'reddit'];
      console.log('[API] Posting to all platforms:', platforms);
      results = await postToAll(content, platforms);
    } else {
      // Post to single platform
      console.log('[API] Posting to single platform:', platform);
      results = await postToAll(content, [platform]);
    }

    const successCount = results.filter(r => r.success).length;
    console.log('[API] Results:', results.map(r => `${r.platform}: ${r.success ? 'OK' : 'FAIL'}`).join(', '));

    return NextResponse.json({
      success: successCount > 0,
      results,
      totalPlatforms: results.length,
      successCount,
    });
  } catch (error) {
    console.error('[API] Social post error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
