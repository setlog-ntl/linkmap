import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt, encrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const getSchema = z.object({
  project_id: z.string().uuid(),
  environment: z.enum(['development', 'staging', 'production']),
  service_id: z.string().uuid().nullable().optional(),
});

const putSchema = z.object({
  project_id: z.string().uuid(),
  environment: z.enum(['development', 'staging', 'production']),
  vars: z.array(z.object({
    key: z.string().min(1).regex(/^[A-Z][A-Z0-9_]*$/),
    value: z.string(),
  })).max(200),
});

/**
 * GET /api/env/raw — 현재 환경의 모든 변수를 복호화하여 반환
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const serviceIdParam = searchParams.get('service_id');
  const parsed = getSchema.safeParse({
    project_id: searchParams.get('project_id'),
    environment: searchParams.get('environment'),
    service_id: serviceIdParam === '__none__' ? null : serviceIdParam || undefined,
  });
  if (!parsed.success) return apiError('잘못된 요청 파라미터입니다', 400);

  const { project_id, environment, service_id: filterServiceId } = parsed.data;

  // 프로젝트 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();
  if (!project) return notFoundError('프로젝트');

  let query = supabase
    .from('environment_variables')
    .select('id, key_name, encrypted_value, is_secret, service_id, description')
    .eq('project_id', project_id)
    .eq('environment', environment)
    .is('deleted_at', null);

  // 서비스 필터 적용
  if (filterServiceId !== undefined) {
    if (filterServiceId === null) {
      query = query.is('service_id', null);
    } else {
      query = query.eq('service_id', filterServiceId);
    }
  }

  const { data: envVars } = await query.order('key_name');

  const vars = (envVars ?? []).map((v) => {
    try {
      return { key: v.key_name, value: decrypt(v.encrypted_value), id: v.id, is_secret: v.is_secret, service_id: v.service_id };
    } catch {
      return { key: v.key_name, value: '', id: v.id, is_secret: v.is_secret, service_id: v.service_id };
    }
  });

  await logAudit(user.id, {
    action: 'env_var.raw_read',
    resourceType: 'environment_variable',
    resourceId: project_id,
    details: { environment, count: vars.length },
  });

  return NextResponse.json({ vars });
}

/**
 * PUT /api/env/raw — 일괄 편집에서 편집된 변수를 diff 적용
 * 기존 변수와 비교하여 추가/수정/삭제 수행
 */
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('잘못된 요청 형식입니다', 400);
  }

  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return apiError('유효하지 않은 데이터입니다', 400);

  const { project_id, environment, vars: newVars } = parsed.data;

  // 프로젝트 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();
  if (!project) return notFoundError('프로젝트');

  // 현재 변수 조회
  const { data: currentVars } = await supabase
    .from('environment_variables')
    .select('id, key_name, encrypted_value')
    .eq('project_id', project_id)
    .eq('environment', environment)
    .is('deleted_at', null);

  const currentMap = new Map<string, { id: string; encrypted_value: string }>();
  for (const v of currentVars ?? []) {
    currentMap.set(v.key_name, { id: v.id, encrypted_value: v.encrypted_value });
  }

  const newKeySet = new Set(newVars.map((v) => v.key));

  let added = 0;
  let updated = 0;
  let deleted = 0;

  // 삭제: 현재 있지만 새 목록에 없는 변수 (soft delete)
  const keysToDelete = [...currentMap.keys()].filter((k) => !newKeySet.has(k));
  if (keysToDelete.length > 0) {
    const idsToDelete = keysToDelete.map((k) => currentMap.get(k)!.id);
    await supabase
      .from('environment_variables')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', idsToDelete);
    deleted = keysToDelete.length;
  }

  // 추가/수정
  for (const nv of newVars) {
    const existing = currentMap.get(nv.key);
    if (!existing) {
      // 새로 추가
      await supabase.from('environment_variables').insert({
        project_id,
        key_name: nv.key,
        encrypted_value: encrypt(nv.value),
        environment,
        is_secret: !nv.key.startsWith('NEXT_PUBLIC_'),
      });
      added++;
    } else {
      // 기존 값과 비교하여 변경된 경우만 업데이트
      try {
        const currentValue = decrypt(existing.encrypted_value);
        if (currentValue !== nv.value) {
          await supabase.from('environment_variables')
            .update({ encrypted_value: encrypt(nv.value), updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          updated++;
        }
      } catch {
        // 복호화 실패 시 무조건 업데이트
        await supabase.from('environment_variables')
          .update({ encrypted_value: encrypt(nv.value), updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        updated++;
      }
    }
  }

  await logAudit(user.id, {
    action: 'env_var.raw_update',
    resourceType: 'environment_variable',
    resourceId: project_id,
    details: { environment, added, updated, deleted },
  });

  return NextResponse.json({ added, updated, deleted });
}
