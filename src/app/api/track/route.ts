import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const trackSchema = z.object({
  session_id: z.string().uuid(),
  page_path: z.string().max(500).startsWith('/'),
  referrer: z.string().max(500).optional(),
  user_agent: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      // silent fail — 메인 플로우 방해 금지
      return NextResponse.json({ ok: true });
    }

    const { session_id, page_path, referrer, user_agent } = parsed.data;

    const supabase = await createClient();
    await supabase.from('visitor_logs').insert({
      session_id,
      page_path,
      referrer: referrer ?? null,
      user_agent: user_agent ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // silent fail — 트래킹 오류가 메인 플로우를 방해하지 않음
    return NextResponse.json({ ok: true });
  }
}
