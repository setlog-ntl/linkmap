import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// 무인증 service_role 쓰기 경로이므로 대용량 행 삽입을 막기 위해 길이 상한을 강제한다
// (2026-07-16 레드팀 F-9). bot_name은 아래 화이트리스트로만 채워진다.
const botLogSchema = z.object({
  path: z.string().min(1).max(2048),
  userAgent: z.string().min(1).max(1024),
  ip: z.string().max(64).nullable().optional(),
});

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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = botLogSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { path, userAgent, ip } = parsed.data;

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
