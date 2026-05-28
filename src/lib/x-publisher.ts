import crypto from 'crypto';

const X_API_KEY = process.env.X_API_KEY || '';
const X_API_SECRET = process.env.X_API_SECRET || '';
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN || '';
const X_TOKEN_SECRET = process.env.X_TOKEN_SECRET || '';

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

interface OAuthParams { [key: string]: string; }

function generateAuthHeader(method: string, url: string, extraParams: OAuthParams = {}): string {
  const oauthParams: OAuthParams = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: X_ACCESS_TOKEN,
    oauth_version: '1.0',
    ...extraParams,
  };

  const baseString = ['POST', percentEncode(url),
    percentEncode(Object.keys(oauthParams).sort()
      .map(k => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
      .join('&'))
  ].join('&');

  const signingKey = `${percentEncode(X_API_SECRET)}&${percentEncode(X_TOKEN_SECRET)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  oauthParams.oauth_signature = signature;

  return `OAuth ${Object.keys(oauthParams).sort()
    .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(', ')}`;
}

export async function postTweet(text: string, replyToTweetId?: string): Promise<{ id: string; text: string }> {
  if (!X_API_KEY || !X_API_SECRET) {
    throw new Error('X API not configured');
  }

  const tweetUrl = 'https://api.x.com/2/tweets';
  const body: Record<string, unknown> = { text };
  if (replyToTweetId) body.reply = { in_reply_to_tweet_id: replyToTweetId };

  const response = await fetch(tweetUrl, {
    method: 'POST',
    headers: {
      Authorization: generateAuthHeader('POST', tweetUrl),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`X tweet post failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return { id: data.data.id, text: data.data.text };
}
