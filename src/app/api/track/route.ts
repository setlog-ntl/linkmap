import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

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
    const ip_address = getClientIp(request);

    const supabase = await createClient();
    await supabase.from('visitor_logs').insert({
      session_id,
      page_path,
      referrer: referrer ?? null,
      user_agent: user_agent ?? null,
      ip_address: ip_address ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
