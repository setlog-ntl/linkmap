import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';

const verifyEnrollSchema = z.object({
  factorId: z.string().min(1),
  code: z.string().length(6),
});

function generateRecoveryCodes(): { plain: string[]; hashed: string[] } {
  const plain: string[] = [];
  const hashed: string[] = [];

  for (let i = 0; i < 10; i++) {
    const raw = randomBytes(4).toString('hex');
    const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plain.push(code);
    hashed.push(createHash('sha256').update(code).digest('hex'));
  }

  return { plain, hashed };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = verifyEnrollSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('factorId와 6자리 코드가 필요합니다', 400);
  }

  const { factorId, code } = parsed.data;

  try {
    // Challenge 생성 → Verify
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

    // 복구 코드 생성 및 저장
    const { plain, hashed } = generateRecoveryCodes();
    const adminClient = createAdminClient();

    // 기존 복구 코드 삭제 후 새로 삽입
    await adminClient
      .from('mfa_recovery_codes')
      .delete()
      .eq('user_id', user.id);

    const rows = hashed.map((code_hash) => ({
      user_id: user.id,
      code_hash,
    }));

    await adminClient.from('mfa_recovery_codes').insert(rows);

    // profiles.mfa_enabled = true
    await adminClient
      .from('profiles')
      .update({ mfa_enabled: true })
      .eq('id', user.id);

    await logAudit(user.id, {
      action: 'mfa.enable',
      resourceType: 'account',
      resourceId: user.id,
    });

    return NextResponse.json({ recoveryCodes: plain });
  } catch {
    return serverError('MFA 등록 검증 중 오류가 발생했습니다');
  }
}
