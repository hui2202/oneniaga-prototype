import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Add it to your environment (.env.local for local dev, or your Vercel/Netlify project env vars) to enable the AI features.'
      );
    }
    client = new Anthropic();
  }
  return client;
}

export async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
  const anthropic = getClient();
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: maxTokens,
      output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n')
      .trim();

    if (!text) throw new Error('Empty response from model');
    return text;
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error('Invalid or missing ANTHROPIC_API_KEY');
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new Error('Rate limited by the Claude API — please try again shortly');
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error ${error.status}: ${error.message}`);
    }
    throw error;
  }
}

// Parses output delimited by ===KEY=== markers — avoids JSON entirely so quotes,
// apostrophes, and line breaks inside the model's text can never break parsing.
export function parseMarkedSections(text: string, keys: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    const marker = `===${key.toUpperCase()}===`;
    const startIdx = text.indexOf(marker);
    if (startIdx === -1) continue;
    const afterStart = startIdx + marker.length;
    let endIdx = text.length;
    for (const other of keys) {
      if (other === key) continue;
      const otherMarker = `===${other.toUpperCase()}===`;
      const otherIdx = text.indexOf(otherMarker, afterStart);
      if (otherIdx !== -1 && otherIdx < endIdx) endIdx = otherIdx;
    }
    result[key] = text.slice(afterStart, endIdx).trim();
  }
  const missing = keys.filter((k) => !result[k]);
  if (missing.length) throw new Error(`Missing sections in model response: ${missing.join(', ')}`);
  return result;
}

// Parses pipe-delimited lines "level|title|reason" — robust against quotes/newlines.
export function parsePipedLines(text: string): { level: string; title: string; reason: string }[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const rows: { level: string; title: string; reason: string }[] = [];
  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length < 3) continue;
    const [level, title, ...rest] = parts;
    rows.push({ level: level.toLowerCase(), title, reason: rest.join(' | ') });
  }
  if (rows.length === 0) throw new Error('Could not find any valid recommendation lines in model response');
  return rows;
}
