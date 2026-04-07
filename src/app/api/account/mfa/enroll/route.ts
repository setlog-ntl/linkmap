import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    // 기존 미검증 factor 정리
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const allTotp = factors?.totp ?? [];
    const unverifiedTotp = allTotp.filter((f) => (f.status as string) !== 'verified');
    for (const factor of unverifiedTotp) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    // 이미 검증된 TOTP가 있으면 에러
    const verifiedTotp = allTotp.filter((f) => f.status === 'verified');
    if (verifiedTotp.length > 0) {
      return apiError('이미 2단계 인증이 활성화되어 있습니다', 409);
    }

    // 새 TOTP factor 등록
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Linkmap TOTP',
    });

    if (error || !data) {
      return apiError(error?.message ?? 'MFA 등록에 실패했습니다', 400);
    }

    return NextResponse.json({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    });
  } catch {
    return serverError('MFA 등록 중 오류가 발생했습니다');
  }
}
