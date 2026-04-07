import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { z } from 'zod';

const challengeSchema = z.object({
  factorId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = challengeSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('factorId가 필요합니다', 400);
  }

  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: parsed.data.factorId,
    });

    if (error || !data) {
      return apiError(error?.message ?? '챌린지 생성에 실패했습니다', 400);
    }

    return NextResponse.json({ challengeId: data.id });
  } catch {
    return serverError('챌린지 생성 중 오류가 발생했습니다');
  }
}
