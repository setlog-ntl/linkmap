import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';
import { createEnvVarSchema, updateEnvVarSchema } from '@/lib/validations/env';
import { unauthorizedError, notFoundError, validationError, quotaExceededError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { triggerAutoSync } from '@/lib/github/auto-sync';
import { checkEnvVarQuota } from '@/lib/quota';
import { buildServiceMapsFromDB, resolveServiceId } from '@/lib/utils/env-service-matcher';
import type { DbEnvVarWithProject } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createEnvVarSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, service_id, project_service_id, key_name, value, environment, is_secret, description } = parsed.data;

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  // 쿼터 체크
  const quota = await checkEnvVarQuota(user.id, project_id);
  if (!quota.allowed) return quotaExceededError('환경변수', quota.current, quota.max);

  const encrypted_value = encrypt(value);

  // service_id 미지정 시 key_name으로 자동 매칭
  const { exactMap, prefixMap } = await buildServiceMapsFromDB(supabase);
  const resolvedServiceId = resolveServiceId(key_name, service_id, exactMap, prefixMap);

  // project_service_id 자동 해석: 명시적 지정이 없으면, 해당 서비스 인스턴스가 1개일 때 자동 할당
  let resolvedPsId = project_service_id ?? null;
  if (!resolvedPsId && resolvedServiceId) {
    const { data: instances } = await supabase
      .from('project_services')
      .select('id')
      .eq('project_id', project_id)
      .eq('service_id', resolvedServiceId);
    if (instances?.length === 1) {
      resolvedPsId = instances[0].id;
    }
  }

  const { data, error } = await supabase
    .from('environment_variables')
    .insert({
      project_id,
      service_id: resolvedServiceId,
      project_service_id: resolvedPsId,
      key_name,
      encrypted_value,
      environment,
      is_secret,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'env_var.create',
    resourceType: 'environment_variable',
    resourceId: data.id,
    details: { key_name, project_id },
  });

  // Trigger auto-sync to GitHub (non-blocking)
  triggerAutoSync(project_id, environment, user.id).catch(() => {});

  return NextResponse.json({ ...data, decrypted_value: value });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateEnvVarSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { id, key_name, value, environment, is_secret, description, service_id } = parsed.data;

  const { data: envVar } = await supabase
    .from('environment_variables')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const envVarTyped = envVar as DbEnvVarWithProject | null;
  if (!envVarTyped || envVarTyped.project.user_id !== user.id) {
    return notFoundError('환경변수');
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (key_name !== undefined) updates.key_name = key_name;
  if (value !== undefined) updates.encrypted_value = encrypt(value);
  if (environment !== undefined) updates.environment = environment;
  if (is_secret !== undefined) updates.is_secret = is_secret;
  if (description !== undefined) updates.description = description;
  if (service_id !== undefined) {
    updates.service_id = service_id;
  } else if (key_name !== undefined && !envVarTyped.service_id) {
    // key_name이 변경되었고 기존 service_id가 없으면 자동 매칭 시도
    const { exactMap, prefixMap } = await buildServiceMapsFromDB(supabase);
    const resolved = resolveServiceId(key_name, null, exactMap, prefixMap);
    if (resolved) updates.service_id = resolved;
  }

  const { data, error } = await supabase
    .from('environment_variables')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'env_var.update',
    resourceType: 'environment_variable',
    resourceId: id,
    details: { updated_fields: Object.keys(updates).filter(k => k !== 'updated_at') },
  });

  // Trigger auto-sync (non-blocking)
  if (data) {
    triggerAutoSync(envVarTyped.project_id, data.environment, user.id).catch(() => {});
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
  }

  const { data: envVar } = await supabase
    .from('environment_variables')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const envVarDel = envVar as DbEnvVarWithProject | null;
  if (!envVarDel || envVarDel.project.user_id !== user.id) {
    return notFoundError('환경변수');
  }

  const { error } = await supabase
    .from('environment_variables')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'env_var.delete',
    resourceType: 'environment_variable',
    resourceId: id,
    details: { key_name: envVarDel.key_name },
  });

  // Trigger auto-sync with deleted key info (non-blocking)
  triggerAutoSync(envVarDel.project_id, envVarDel.environment, user.id, {
    deletedKeys: [envVarDel.key_name],
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
