/**
 * Social Media Publisher — Multi-platform posting with console logging
 * Supports: X (Twitter), Instagram, TikTok, Facebook, YouTube, Reddit
 */

const DEBUG = true; // Enable console logging for all operations

function log(platform: string, action: string, data?: any) {
  if (DEBUG) {
    console.log(`[Social:${platform}] ${action}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

function logError(platform: string, action: string, error: any) {
  console.error(`[Social:${platform}] ERROR ${action}:`, error);
}

// =============================================================================
// X (Twitter) Publisher
// =============================================================================

import crypto from 'crypto';

const X_API_KEY = process.env.X_API_KEY || '';
const X_API_SECRET = process.env.X_API_SECRET || '';
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN || '';
const X_TOKEN_SECRET = process.env.X_TOKEN_SECRET || '';

function generateXAuthHeader(method: string, url: string, extraParams: Record<string, string> = {}): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: X_ACCESS_TOKEN,
    oauth_version: '1.0',
    ...extraParams,
  };

  const sortedKeys = Object.keys(oauthParams).sort();
  const paramString = sortedKeys
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join('&');
  
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(X_API_SECRET)}&${encodeURIComponent(X_TOKEN_SECRET)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  
  oauthParams.oauth_signature = signature;
  
  const authHeader = Object.keys(oauthParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ');
  
  return `OAuth ${authHeader}`;
}

export async function postToX(text: string, mediaUrls: string[] = []): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('X', 'Posting', { text: text.substring(0, 100), mediaCount: mediaUrls.length });
  
  if (!X_API_KEY || !X_API_SECRET) {
    logError('X', 'post', 'X API credentials not configured');
    return { success: false, error: 'X API credentials not configured. Set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_TOKEN_SECRET in .env.local' };
  }

  try {
    // Upload media first if provided
    let mediaIds: string[] = [];
    for (const url of mediaUrls) {
      log('X', 'Uploading media', { url: url.substring(0, 80) });
      // Media upload would go here
    }

    // Post tweet
    const tweetUrl = 'https://api.x.com/2/tweets';
    const body: any = { text };
    if (mediaIds.length > 0) {
      body.media = { media_ids: mediaIds };
    }

    const authHeader = generateXAuthHeader('POST', tweetUrl);
    log('X', 'Auth header generated', { headerLength: authHeader.length });

    const response = await fetch(tweetUrl, {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      logError('X', 'post', { status: response.status, error: data });
      return { success: false, error: `X API error: ${JSON.stringify(data)}` };
    }

    const postId = data.data?.id;
    log('X', 'Post successful', { postId });
    return { success: true, postId };
  } catch (error) {
    logError('X', 'post', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// Instagram Publisher
// =============================================================================

const IG_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const IG_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';

export async function postToInstagram(caption: string, imageUrl: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('Instagram', 'Posting', { caption: caption.substring(0, 100), imageUrl: imageUrl.substring(0, 80) });
  
  if (!IG_ACCESS_TOKEN || !IG_BUSINESS_ACCOUNT_ID) {
    logError('Instagram', 'post', 'Instagram credentials not configured');
    return { success: false, error: 'Instagram credentials not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in .env.local' };
  }

  try {
    // Step 1: Create media container
    const createUrl = `https://graph.facebook.com/v18.0/${IG_BUSINESS_ACCOUNT_ID}/media`;
    log('Instagram', 'Creating media container');
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: IG_ACCESS_TOKEN,
      }),
    });
    
    const createData = await createResponse.json();
    if (!createResponse.ok) {
      logError('Instagram', 'create container', createData);
      return { success: false, error: `Instagram API error: ${JSON.stringify(createData)}` };
    }
    
    const containerId = createData.id;
    log('Instagram', 'Container created', { containerId });

    // Step 2: Publish container
    const publishUrl = `https://graph.facebook.com/v18.0/${IG_BUSINESS_ACCOUNT_ID}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: IG_ACCESS_TOKEN,
      }),
    });
    
    const publishData = await publishResponse.json();
    if (!publishResponse.ok) {
      logError('Instagram', 'publish', publishData);
      return { success: false, error: `Instagram publish error: ${JSON.stringify(publishData)}` };
    }

    log('Instagram', 'Post successful', { postId: publishData.id });
    return { success: true, postId: publishData.id };
  } catch (error) {
    logError('Instagram', 'post', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// TikTok Publisher
// =============================================================================

const TT_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || '';
const TT_OPEN_ID = process.env.TIKTOK_OPEN_ID || '';

export async function postToTikTok(title: string, videoUrl: string, description?: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('TikTok', 'Posting', { title, videoUrl: videoUrl.substring(0, 80) });
  
  if (!TT_ACCESS_TOKEN || !TT_OPEN_ID) {
    logError('TikTok', 'post', 'TikTok credentials not configured');
    return { success: false, error: 'TikTok credentials not configured. Set TIKTOK_ACCESS_TOKEN and TIKTOK_OPEN_ID in .env.local' };
  }

  try {
    // TikTok Video Publish API
    const url = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
    log('TikTok', 'Initializing video publish');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: title,
          description: description || title,
          privacy_level: 'PUBLIC',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        },
        source_info: {
          source: 'URL',
          video_url: videoUrl,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      logError('TikTok', 'post', { status: response.status, error: data });
      return { success: false, error: `TikTok API error: ${JSON.stringify(data)}` };
    }

    const postId = data.data?.publish_id;
    log('TikTok', 'Post initiated', { postId });
    return { success: true, postId };
  } catch (error) {
    logError('TikTok', 'post', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// Facebook Publisher
// =============================================================================

const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

export async function postToFacebook(message: string, mediaUrl?: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('Facebook', 'Posting', { message: message.substring(0, 100), hasMedia: !!mediaUrl });
  
  if (!FB_ACCESS_TOKEN || !FB_PAGE_ID) {
    logError('Facebook', 'post', 'Facebook credentials not configured');
    return { success: false, error: 'Facebook credentials not configured. Set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in .env.local' };
  }

  try {
    const isVideo = mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov'));
    const endpoint = isVideo ? 'videos' : 'feed';
    const url = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/${endpoint}`;
    
    log('Facebook', `Posting to ${endpoint}`, { url: url.substring(0, 80) });
    
    const body: any = { access_token: FB_ACCESS_TOKEN };
    if (isVideo) {
      body.file_url = mediaUrl;
      body.description = message;
    } else {
      body.message = message;
      if (mediaUrl) body.link = mediaUrl;
    }

    const response = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams(body),
    });

    const data = await response.json();
    if (!response.ok) {
      logError('Facebook', 'post', data);
      return { success: false, error: `Facebook API error: ${JSON.stringify(data)}` };
    }

    log('Facebook', 'Post successful', { postId: data.id });
    return { success: true, postId: data.id };
  } catch (error) {
    logError('Facebook', 'post', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// YouTube Publisher
// =============================================================================

const YT_ACCESS_TOKEN = process.env.YOUTUBE_ACCESS_TOKEN || '';
const YT_REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN || '';
const YT_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const YT_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';

export async function postToYouTube(title: string, description: string, videoUrl: string, tags: string[] = []): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('YouTube', 'Uploading', { title, videoUrl: videoUrl.substring(0, 80) });
  
  if (!YT_ACCESS_TOKEN) {
    logError('YouTube', 'upload', 'YouTube credentials not configured');
    return { success: false, error: 'YouTube credentials not configured. Set YOUTUBE_ACCESS_TOKEN in .env.local' };
  }

  try {
    // YouTube Data API v3 — initiate resumable upload
    const metadata = {
      snippet: { title, description, tags },
      status: { privacyStatus: 'public', selfDeclaredMadeForKids: false },
    };

    log('YouTube', 'Initiating resumable upload');
    
    const videoResponse = await fetch(videoUrl);
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    
    const initResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=resumable',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Length': videoBuffer.length.toString(),
          'X-Upload-Content-Type': 'video/mp4',
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!initResponse.ok) {
      const errorData = await initResponse.json();
      logError('YouTube', 'init upload', errorData);
      return { success: false, error: `YouTube init error: ${JSON.stringify(errorData)}` };
    }

    const uploadUrl = initResponse.headers.get('location');
    if (!uploadUrl) {
      logError('YouTube', 'init upload', 'No upload URL returned');
      return { success: false, error: 'No upload URL from YouTube' };
    }

    log('YouTube', 'Uploading video data', { size: videoBuffer.length });
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'video/mp4' },
      body: videoBuffer,
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) {
      logError('YouTube', 'upload', uploadData);
      return { success: false, error: `YouTube upload error: ${JSON.stringify(uploadData)}` };
    }

    log('YouTube', 'Upload successful', { videoId: uploadData.id });
    return { success: true, postId: uploadData.id };
  } catch (error) {
    logError('YouTube', 'upload', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// Reddit Publisher
// =============================================================================

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';
const REDDIT_USERNAME = process.env.REDDIT_USERNAME || '';
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD || '';

export async function postToReddit(
  subreddit: string,
  title: string,
  text: string,
  imageUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  log('Reddit', 'Posting', { subreddit, title: title.substring(0, 80), hasImage: !!imageUrl });
  
  if (!REDDIT_CLIENT_ID || !REDDIT_USERNAME) {
    logError('Reddit', 'post', 'Reddit credentials not configured');
    return { success: false, error: 'Reddit credentials not configured. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD in .env.local' };
  }

  try {
    // Step 1: Get access token
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: REDDIT_USERNAME,
        password: REDDIT_PASSWORD,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      logError('Reddit', 'auth', tokenData);
      return { success: false, error: `Reddit auth error: ${JSON.stringify(tokenData)}` };
    }

    const accessToken = tokenData.access_token;
    log('Reddit', 'Authenticated');

    // Step 2: Submit post
    const postType = imageUrl ? 'image' : 'self';
    const submitBody: any = {
      sr: subreddit,
      title: title,
      kind: postType,
      api_type: 'json',
    };

    if (imageUrl) {
      submitBody.url = imageUrl;
    } else {
      submitBody.text = text;
    }

    log('Reddit', `Submitting ${postType} post to r/${subreddit}`);
    
    const submitResponse = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'PawMeBot/1.0',
      },
      body: new URLSearchParams(submitBody),
    });

    const submitData = await submitResponse.json();
    if (!submitResponse.ok) {
      logError('Reddit', 'submit', submitData);
      return { success: false, error: `Reddit submit error: ${JSON.stringify(submitData)}` };
    }

    const postId = submitData.json?.data?.name;
    log('Reddit', 'Post successful', { postId, permalink: submitData.json?.data?.url });
    return { success: true, postId };
  } catch (error) {
    logError('Reddit', 'post', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// =============================================================================
// Multi-platform poster
// =============================================================================

export interface PostContent {
  text: string;
  title?: string;
  mediaUrls?: string[];
  tags?: string[];
}

export interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

export async function postToAll(content: PostContent, platforms: string[]): Promise<PostResult[]> {
  log('Multi', 'Posting to platforms', { platforms, textLength: content.text.length, mediaCount: content.mediaUrls?.length || 0 });
  
  const results: PostResult[] = [];
  
  for (const platform of platforms) {
    let result: { success: boolean; postId?: string; error?: string };
    
    switch (platform.toLowerCase()) {
      case 'x':
      case 'twitter':
        result = await postToX(content.text, content.mediaUrls || []);
        break;
      case 'instagram':
      case 'ig':
        result = content.mediaUrls?.length 
          ? await postToInstagram(content.text, content.mediaUrls[0])
          : { success: false, error: 'Instagram requires at least one image' };
        break;
      case 'tiktok':
      case 'tt':
        result = content.mediaUrls?.length
          ? await postToTikTok(content.title || content.text, content.mediaUrls[0])
          : { success: false, error: 'TikTok requires a video' };
        break;
      case 'facebook':
      case 'fb':
        result = await postToFacebook(content.text, content.mediaUrls?.[0]);
        break;
      case 'youtube':
      case 'yt':
        result = content.mediaUrls?.length
          ? await postToYouTube(content.title || content.text, content.text, content.mediaUrls[0], content.tags)
          : { success: false, error: 'YouTube requires a video' };
        break;
      case 'reddit':
        result = await postToReddit('PawMeBot', content.title || content.text.substring(0, 100), content.text, content.mediaUrls?.[0]);
        break;
      default:
        result = { success: false, error: `Unknown platform: ${platform}` };
    }
    
    results.push({ platform, ...result });
    log('Multi', `${platform} result: ${result.success ? 'SUCCESS' : 'FAILED'}`, result.postId || result.error);
  }
  
  const successCount = results.filter(r => r.success).length;
  log('Multi', `Complete: ${successCount}/${platforms.length} successful`);
  
  return results;
}

// =============================================================================
// Platform status check
// =============================================================================

export function getPlatformStatus(): Array<{ name: string; key: string; configured: boolean; envVar: string }> {
  return [
    { name: 'X (Twitter)', key: 'x', configured: !!(X_API_KEY && X_API_SECRET && X_ACCESS_TOKEN && X_TOKEN_SECRET), envVar: 'X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_TOKEN_SECRET' },
    { name: 'Instagram', key: 'ig', configured: !!(IG_ACCESS_TOKEN && IG_BUSINESS_ACCOUNT_ID), envVar: 'INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID' },
    { name: 'TikTok', key: 'tt', configured: !!(TT_ACCESS_TOKEN && TT_OPEN_ID), envVar: 'TIKTOK_ACCESS_TOKEN, TIKTOK_OPEN_ID' },
    { name: 'Facebook', key: 'fb', configured: !!(FB_ACCESS_TOKEN && FB_PAGE_ID), envVar: 'FACEBOOK_ACCESS_TOKEN, FACEBOOK_PAGE_ID' },
    { name: 'YouTube', key: 'yt', configured: !!YT_ACCESS_TOKEN, envVar: 'YOUTUBE_ACCESS_TOKEN, YOUTUBE_REFRESH_TOKEN' },
    { name: 'Reddit', key: 'reddit', configured: !!(REDDIT_CLIENT_ID && REDDIT_USERNAME && REDDIT_PASSWORD), envVar: 'REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD' },
  ];
}
