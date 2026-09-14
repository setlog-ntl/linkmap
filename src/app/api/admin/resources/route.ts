import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { createResourceSchema } from '@/lib/validations/resource';
import type { FreeResourceRow } from '@/types';

const TABLE = 'free_resources';

/** Postgres unique_violation — slug 중복 */
const PG_UNIQUE_VIOLATION = '23505';

// 쓰기는 user-scoped 클라이언트로 한다 — RLS admin_full_access가 실효 방어선이고
// createAdminClient()는 감사 로그 전용이다 (CLAUDE.md).

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Free resource list error:', error);
    return serverError('자료 목록 조회에 실패했습니다');
  }

  return NextResponse.json({ resources: (data ?? []) as FreeResourceRow[] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  // 본문이 JSON이 아니면 null → safeParse가 400으로 처리한다
  const body = await request.json().catch(() => null);
  const parsed = createResourceSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...parsed.data, created_by: user.id })
    .select()
    .single();

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return apiError('이미 사용 중인 slug입니다', 409);
    console.error('Free resource create error:', error);
    return serverError('자료 생성에 실패했습니다');
  }

  const resource = data as FreeResourceRow;

  await logAudit(user.id, {
    action: 'admin.resource_create',
    resourceType: TABLE,
    resourceId: resource.id,
    details: {
      slug: resource.slug,
      title: resource.title,
      is_published: resource.is_published,
    },
  });

  return NextResponse.json({ resource }, { status: 201 });
}
