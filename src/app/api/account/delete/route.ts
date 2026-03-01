import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const deleteSchema = z.object({
  confirmText: z.string(),
});

export async function DELETE(request: NextRequest) {
  // 1. 인증 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod safeParse — 확인 문구 검증
  const body = await request.json();
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('확인 문구가 필요합니다', 400);
  }

  const { confirmText } = parsed.data;
  if (confirmText !== '계정 삭제' && confirmText !== 'Delete Account') {
    return apiError('확인 문구가 일치하지 않습니다', 400);
  }

  // 3. 소유권 확인 — 본인 계정만 삭제 가능 (getUser()로 이미 보장)

  // 4. 감사 로그 선기록 (삭제 후에는 user_id 참조 불가)
  await logAudit(user.id, {
    action: 'account.delete',
    resourceType: 'account',
    resourceId: user.id,
    details: { email: user.email },
  });

  // 5. 비즈니스 로직 — Admin API로 사용자 삭제 (cascade)
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(user.id);

    if (error) {
      return apiError(error.message, 500);
    }

    return NextResponse.json({ success: true });
  } catch {
    return serverError('계정 삭제 중 오류가 발생했습니다');
  }
}
