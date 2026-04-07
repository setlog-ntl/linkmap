import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError } from '@/lib/api/errors';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    const totpFactors = factors?.totp ?? [];
    const verifiedFactors = totpFactors.filter((f) => f.status === 'verified');

    return NextResponse.json({
      enabled: verifiedFactors.length > 0,
      factorId: verifiedFactors[0]?.id ?? null,
      currentLevel: aal?.currentLevel ?? 'aal1',
      nextLevel: aal?.nextLevel ?? 'aal1',
    });
  } catch {
    return serverError('MFA 상태 조회에 실패했습니다');
  }
}
