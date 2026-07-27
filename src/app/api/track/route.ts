import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { hashIp, VISITOR_LOG_IP_SALT } from '@/lib/utils/hash-ip';

const trackSchema = z.object({
  session_id: z.string().uuid(),
  page_path: z.string().max(500).startsWith('/'),
  referrer: z.string().max(500).optional(),
  user_agent: z.string().max(500).optional(),
});

function getClientIp(request: NextRequest): string | null {
  // Cloudflare Workers
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // 표준 프록시 헤더 (첫 번째 IP가 클라이언트 IP)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: true });
    }

    const { session_id, page_path, referrer, user_agent } = parsed.data;
    // 평문 IP는 저장하지 않는다 — 단방향 해시로만 기록해 중복 방문 판별 용도만 남긴다
    // (보존기간·파기 절차 없이 개인정보가 누적되던 문제, 2026-07-16 레드팀 F-7)
    const clientIp = getClientIp(request);
    const ip_hash = clientIp ? await hashIp(clientIp, VISITOR_LOG_IP_SALT) : null;

    const supabase = await createClient();
    const { error } = await supabase.from('visitor_logs').insert({
      session_id,
      page_path,
      referrer: referrer ?? null,
      user_agent: user_agent ?? null,
      ip_address: ip_hash,
    });

    // 트래킹 실패는 UX를 막지 않지만(항상 ok:true), 원인 추적을 위해 계량한다
    // — silent catch 금지 규칙. 삽입 오류를 조용히 삼키지 않는다.
    if (error) {
      console.error('[track] visitor_logs insert failed:', error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track] unexpected error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: true });
  }
}
