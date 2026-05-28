import type { CommunityPost } from '@/types';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramResult {
  ok: boolean;
  result?: { message_id: number; chat: { id: number; title: string } };
  description?: string;
}

export async function sendTelegramMessage(
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<number | null> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.warn('Telegram not configured - skipping');
    return null;
  }

  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });

  const data: TelegramResult = await response.json();
  if (!data.ok) throw new Error(`Telegram sendMessage failed: ${data.description}`);
  return data.result?.message_id || null;
}

export async function sendTelegramPhoto(photoUrl: string, caption: string): Promise<number | null> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    console.warn('Telegram not configured - skipping');
    return null;
  }

  const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML',
    }),
  });

  const data: TelegramResult = await response.json();
  if (!data.ok) throw new Error(`Telegram sendPhoto failed: ${data.description}`);
  return data.result?.message_id || null;
}

export function formatForTelegram(text: string): string {
  let result = text;
  result = result.replace(/@(\w+)/g, '<a href="https://x.com/$1">@$1</a>');
  result = result.replace(/#(\w+)/g, '<a href="https://x.com/hashtag/$1">#$1</a>');
  result = result.replace(
    /(?<![">])(https?:\/\/[^\s<]+)/g,
    '<a href="$1">$1</a>'
  );
  return result;
}

export function formatCommunityPostForTelegram(post: CommunityPost): string {
  const tags = post.tags?.map(t => `#${t}`).join(' ') || '';
  let text = `🐾 <b>New on PawMe Community</b>\n\n`;

  if (post.title) text += `<b>${post.title}</b>\n\n`;
  text += post.content;
  if (tags) text += `\n\n${tags}`;
  text += `\n\n🔗 pawme.ayvalabs.com`;

  return formatForTelegram(text);
}
