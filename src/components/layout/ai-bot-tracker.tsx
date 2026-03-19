import { headers } from 'next/headers';

const AI_BOT_PATTERNS = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /Google-Extended/i,
  /PerplexityBot/i,
  /ClaudeBot/i,
  /anthropic-ai/i,
  /Bytespider/i,
  /CCBot/i,
];

function isAiBot(ua: string): boolean {
  return AI_BOT_PATTERNS.some((p) => p.test(ua));
}

/**
 * 서버 컴포넌트: AI 봇 UA 감지 시 Supabase REST API로 직접 로깅.
 * - 렌더링 출력 없음 (null 반환)
 * - Workers 환경: self-fetch 금지 → Supabase REST API 직접 호출
 * - fire-and-forget: 응답 미대기로 렌더링 블로킹 없음
 */
export async function AiBotTracker({ path }: { path: string }) {
  const headerStore = await headers();
  const ua = headerStore.get('user-agent') ?? '';

  if (!isAiBot(ua)) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  const ip =
    headerStore.get('cf-connecting-ip') ??
    headerStore.get('x-forwarded-for') ??
    null;

  const botName = AI_BOT_PATTERNS.reduce<string | null>((found, p, i) => {
    if (found) return found;
    if (p.test(ua)) {
      const names = [
        'GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot',
        'ClaudeBot', 'anthropic-ai', 'Bytespider', 'CCBot',
      ];
      return names[i] ?? null;
    }
    return null;
  }, null);

  if (!botName) return null;

  // fire-and-forget: Supabase REST API 직접 호출 (await 없음)
  fetch(`${supabaseUrl}/rest/v1/ai_bot_logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      bot_name: botName,
      path,
      user_agent: ua,
      ip_address: ip,
    }),
  }).catch(() => {
    // 의도적 catch: 테이블 미존재·네트워크 오류 시 흡수
    // 로깅 실패가 페이지 렌더링을 중단시키면 안 됨
  });

  return null;
}
