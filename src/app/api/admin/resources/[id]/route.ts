import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import {
  unauthorizedError,
  apiError,
  notFoundError,
  serverError,
  validationError,
} from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { updateResourceSchema } from '@/lib/validations/resource';
import type { FreeResourceRow } from '@/types';

type RouteContext = { params: Promise<{ id: string }> };

const TABLE = 'free_resources';

/** Postgres unique_violation — slug 중복 */
const PG_UNIQUE_VIOLATION = '23505';
/** Postgres invalid_text_representation — UUID 형식이 아닌 id */
const PG_INVALID_TEXT_REPRESENTATION = '22P02';
/** PostgREST — .single()에 매칭 행 없음 */
const PGRST_NO_ROWS = 'PGRST116';

function isNotFoundCode(code: string | undefined): boolean {
  return code === PGRST_NO_ROWS || code === PG_INVALID_TEXT_REPRESENTATION;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();

  if (error) {
    if (isNotFoundCode(error.code)) return notFoundError('자료');
    console.error('Free resource fetch error:', error);
    return serverError('자료 조회에 실패했습니다');
  }

  return NextResponse.json({ resource: data as FreeResourceRow });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json().catch(() => null);
  const parsed = updateResourceSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  if (Object.keys(parsed.data).length === 0) return apiError('변경할 항목이 없습니다', 400);

  const { data, error } = await supabase
    .from(TABLE)
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (isNotFoundCode(error.code)) return notFoundError('자료');
    if (error.code === PG_UNIQUE_VIOLATION) return apiError('이미 사용 중인 slug입니다', 409);
    console.error('Free resource update error:', error);
    return serverError('자료 수정에 실패했습니다');
  }

  const resource = data as FreeResourceRow;

  await logAudit(user.id, {
    action: 'admin.resource_update',
    resourceType: TABLE,
    resourceId: id,
    details: {
      slug: resource.slug,
      fields: Object.keys(parsed.data),
      is_published: resource.is_published,
    },
  });

  return NextResponse.json({ resource });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  // 삭제된 행을 돌려받아 존재 여부를 판정한다 (없으면 PGRST116)
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .select('id, slug')
    .single();

  if (error) {
    if (isNotFoundCode(error.code)) return notFoundError('자료');
    console.error('Free resource delete error:', error);
    return serverError('자료 삭제에 실패했습니다');
  }

  await logAudit(user.id, {
    action: 'admin.resource_delete',
    resourceType: TABLE,
    resourceId: id,
    details: { slug: (data as Pick<FreeResourceRow, 'id' | 'slug'>).slug },
  });

  return NextResponse.json({ success: true });
}
