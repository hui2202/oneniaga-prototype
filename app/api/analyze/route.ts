import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { UI_LANGUAGES, WEEKLY_SALES } from '@/lib/seed';

export async function POST(req: NextRequest) {
  let body: { lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const languageLabel = UI_LANGUAGES.find((l) => l.id === body.lang)?.label || 'English';

  const prompt = `You are OneNiaga's AI analytics assistant. Here is one seller's last 7 days revenue (RM) by platform:
${JSON.stringify(WEEKLY_SALES)}
Write a short 2-3 sentence business-owner-friendly interpretation, entirely in ${languageLabel}: identify the clearest trend, name which platform is rising/falling, and give one plausible reason. Plain language, no jargon.
Respond with ONLY the 2-3 sentences as plain text — no JSON, no quotation marks around it, no preamble, no markdown.`;

  try {
    const text = await callClaude(prompt);
    return NextResponse.json({ summary: text.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
