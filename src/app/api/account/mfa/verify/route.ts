import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const verifySchema = z.object({
  factorId: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return apiError('factorId와 6자리 코드가 필요합니다', 400);
  }

  const { factorId, code } = parsed.data;

  try {
    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError || !challenge) {
      return apiError('챌린지 생성에 실패했습니다', 400);
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      return apiError('인증 코드가 올바르지 않습니다', 400);
    }

    await logAudit(user.id, {
      action: 'mfa.verify',
      resourceType: 'account',
      resourceId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch {
    return serverError('MFA 검증 중 오류가 발생했습니다');
  }
}
