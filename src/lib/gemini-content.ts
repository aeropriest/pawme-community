import type { CommunityPost } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const DEFAULT_TEXT_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest'];

async function runGeminiRequest(prompt: string, jsonMode = false): Promise<{ text: string; modelUsed: string }> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const payload: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (jsonMode) {
    payload.generationConfig = { response_mime_type: 'application/json', temperature: 0.3 };
  }

  for (const model of DEFAULT_TEXT_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const text: string = data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text || '')
        .join('\n') || '';

      if (text) {
        return { text, modelUsed: model };
      }
    } catch {
      continue;
    }
  }

  throw new Error('All Gemini models failed');
}

export async function generatePostContent(context: {
  pillar: string;
  topic: string;
  sourceMaterial?: string;
  style?: string;
}): Promise<{ title: string; content: string; hashtags: string[] }> {
  const prompt = `You are writing for the PawMeBot community (r/PawMeBot style) — an AI-powered wheeled companion robot project by Ayva Labs.

Topic pillar: ${context.pillar}
Topic: ${context.topic}
${context.sourceMaterial ? `Source material: ${context.sourceMaterial}` : ''}
Style: friendly, technical but accessible, BuildInPublic tone

Generate:
1. A catchy title (under 80 chars)
2. Post content (200-400 words, engaging, with emojis)
3. 3-5 relevant hashtags

Return JSON: { "title": "...", "content": "...", "hashtags": ["..."] }`;

  const result = await runGeminiRequest(prompt, true);
  const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateTimelineEvent(sourceMaterial: string): Promise<{
  date: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}> {
  const prompt = `Extract a timeline event from this source material about PawMeBot development:

"${sourceMaterial.substring(0, 3000)}"

Return JSON: { "date": "YYYY-MM-DD", "title": "...", "description": "...", "category": "prototype|design|firmware|software|manufacturing|media|partnership|award|milestone", "tags": ["..."] }`;

  const result = await runGeminiRequest(prompt, true);
  const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateDailyPosts(
  sourceMaterials: string[],
  count: number = 10
): Promise<Array<{ pillar: string; title: string; content: string; tags: string[]; imagePrompt?: string }>> {
  const prompt = `You are generating ${count} daily social posts for the PawMeBot community.

Source materials from WhatsApp history, dev logs, git history:
${sourceMaterials.slice(0, 5).join('\n---\n')}

Generate ${count} posts covering these pillars (distribute evenly):
- build_in_public: Development progress, challenges, behind-the-scenes
- product_showcase: Features, demos, prototypes
- founder_voice: Personal reflections, vision, lessons learned
- community_prompt: Questions, polls, engagement posts
- market_context: Industry trends, competitor analysis, pet tech

Each post should feel natural, authentic, and engaging. Return JSON array:
[{ "pillar": "...", "title": "...", "content": "200-300 words", "tags": ["..."], "imagePrompt": "optional image description" }]`;

  const result = await runGeminiRequest(prompt, true);
  const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}
