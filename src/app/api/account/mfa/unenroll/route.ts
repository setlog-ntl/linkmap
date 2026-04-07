import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const unenrollSchema = z.object({
  factorId: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = unenrollSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('factorId와 6자리 코드가 필요합니다', 400);
  }

  const { factorId, code } = parsed.data;

  try {
    // 현재 TOTP 코드 검증
    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError || !challenge) {
      return apiError('인증 챌린지 생성에 실패했습니다', 400);
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      return apiError('인증 코드가 올바르지 않습니다', 400);
    }

    // MFA factor 해제
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
    if (unenrollError) {
      return apiError('MFA 해제에 실패했습니다', 400);
    }

    // 복구 코드 삭제 + mfa_enabled 해제
    const adminClient = createAdminClient();
    await adminClient
      .from('mfa_recovery_codes')
      .delete()
      .eq('user_id', user.id);

    await adminClient
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', user.id);

    await logAudit(user.id, {
      action: 'mfa.disable',
      resourceType: 'account',
      resourceId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch {
    return serverError('MFA 해제 중 오류가 발생했습니다');
  }
}
