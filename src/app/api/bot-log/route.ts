import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const AI_BOTS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /GPTBot/i, name: 'GPTBot' },
  { pattern: /ChatGPT-User/i, name: 'ChatGPT-User' },
  { pattern: /Google-Extended/i, name: 'Google-Extended' },
  { pattern: /PerplexityBot/i, name: 'PerplexityBot' },
  { pattern: /ClaudeBot/i, name: 'ClaudeBot' },
  { pattern: /anthropic-ai/i, name: 'anthropic-ai' },
  { pattern: /Bytespider/i, name: 'Bytespider' },
  { pattern: /CCBot/i, name: 'CCBot' },
];

function detectAiBot(ua: string): string | null {
  for (const bot of AI_BOTS) {
    if (bot.pattern.test(ua)) return bot.name;
  }
  return null;
}

/**
 * POST /api/bot-log
 * 서버 컴포넌트에서 AI 봇 감지 시 호출.
 * Body: { path: string, userAgent: string, ip: string | null }
 */
export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let body: { path?: string; userAgent?: string; ip?: string | null };
  try {
    body = await request.json() as { path?: string; userAgent?: string; ip?: string | null };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { path, userAgent, ip } = body;
  if (!path || !userAgent) {
    return NextResponse.json({ error: 'Missing path or userAgent' }, { status: 400 });
  }

  const botName = detectAiBot(userAgent);
  if (!botName) {
    return NextResponse.json({ ok: false, reason: 'not a bot' }, { status: 200 });
  }

  const insertBody = JSON.stringify({
    bot_name: botName,
    path,
    user_agent: userAgent,
    ip_address: ip ?? null,
  });

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/ai_bot_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: insertBody,
    });

    if (!res.ok) {
      // 테이블 미존재 등 — 에러를 반환하되 앱 중단은 없음
      return NextResponse.json(
        { ok: false, status: res.status },
        { status: 200 }
      );
    }
  } catch (err: unknown) {
    // 네트워크 오류 — 로깅 실패가 사용자에게 영향 주면 안 됨
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
