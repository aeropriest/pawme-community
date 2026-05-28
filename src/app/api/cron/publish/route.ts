import { NextRequest, NextResponse } from 'next/server';
import { getScheduledPosts, updateCommunityPostStatus } from '@/lib/community-store';
import { formatCommunityPostForTelegram, sendTelegramMessage, sendTelegramPhoto } from '@/lib/telegram-publisher';
import { postTweet } from '@/lib/x-publisher';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await getScheduledPosts();
    const results: Array<{ postId: string; status: string; xId?: string; telegramId?: number; error?: string }> = [];

    for (const post of posts) {
      const result: typeof results[0] = { postId: post.id, status: 'processing' };

      try {
        // Post to X/Twitter
        if (post.platforms === 'x' || post.platforms === 'both') {
          const cleanText = post.title ? `${post.title}\n\n${post.content}` : post.content;
          const xResult = await postTweet(cleanText);
          result.xId = xResult.id;
        }

        // Post to Telegram
        if (post.platforms === 'telegram' || post.platforms === 'both') {
          const tgText = formatCommunityPostForTelegram(post);

          if (post.imageUrls && post.imageUrls.length > 0) {
            const tgResult = await sendTelegramPhoto(post.imageUrls[0], tgText);
            result.telegramId = tgResult ?? undefined;
          } else {
            const tgResult = await sendTelegramMessage(tgText);
            result.telegramId = tgResult ?? undefined;
          }
        }

        // Update status
        await updateCommunityPostStatus(post.id, 'published', {
          publishedAt: new Date().toISOString(),
          xPostId: result.xId,
          telegramMessageId: result.telegramId,
        });

        result.status = 'published';
      } catch (err) {
        result.status = 'failed';
        result.error = err instanceof Error ? err.message : String(err);
        await updateCommunityPostStatus(post.id, 'failed', {
          errorMessage: result.error,
        });
      }

      results.push(result);
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error('Cron publish error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
