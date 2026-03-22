import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { logAudit } from '@/lib/audit';
import { unauthorizedError, validationError, serverError, apiError } from '@/lib/api/errors';
import { indexNowSchema, submitUrls } from '@/lib/seo/indexnow';

export async function POST(request: Request) {
  // 1. 인증
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod 검증
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('잘못된 JSON 형식입니다', 400);
  }
  const parsed = indexNowSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // 3. 관리자 확인
  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  // 4. IndexNow 제출
  const result = await submitUrls(parsed.data.urls);

  // 5. 감사 로그
  await logAudit(user.id, {
    action: 'admin.indexnow_submit',
    resourceType: 'seo',
    details: {
      urlCount: parsed.data.urls.length,
      status: result.status,
      ok: result.ok,
    },
  });

  if (!result.ok) {
    return serverError(result.message);
  }

  return Response.json({ success: true, message: result.message });
}
