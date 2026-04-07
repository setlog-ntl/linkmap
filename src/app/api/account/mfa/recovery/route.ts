import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';
import { createHash } from 'crypto';

const recoverySchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = recoverySchema.safeParse(body);
  if (!parsed.success) {
    return apiError('복구 코드가 필요합니다', 400);
  }

  const inputHash = createHash('sha256').update(parsed.data.code).digest('hex');

  try {
    const adminClient = createAdminClient();

    // 미사용 복구 코드 조회
    const { data: codes } = await adminClient
      .from('mfa_recovery_codes')
      .select('id, code_hash')
      .eq('user_id', user.id)
      .is('used_at', null);

    const matched = codes?.find((c) => c.code_hash === inputHash);
    if (!matched) {
      return apiError('유효하지 않은 복구 코드입니다', 400);
    }

    // 코드 사용 처리
    await adminClient
      .from('mfa_recovery_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', matched.id);

    // MFA factor 해제 (복구 코드 사용 시 MFA 완전 해제)
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verifiedTotp = factors?.totp?.filter((f) => f.status === 'verified') ?? [];
    for (const factor of verifiedTotp) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    // mfa_enabled 해제
    await adminClient
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', user.id);

    // 남은 미사용 코드 삭제
    await adminClient
      .from('mfa_recovery_codes')
      .delete()
      .eq('user_id', user.id);

    await logAudit(user.id, {
      action: 'mfa.recovery_used',
      resourceType: 'account',
      resourceId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: '2단계 인증이 해제되었습니다. 필요하면 다시 설정해주세요.',
    });
  } catch {
    return serverError('복구 코드 처리 중 오류가 발생했습니다');
  }
}
