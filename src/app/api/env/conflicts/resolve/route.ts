import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { resolveConflictSchema } from '@/lib/validations/env-conflicts';
import { triggerAutoSync } from '@/lib/github/auto-sync';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = resolveConflictSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, key_name, source_env, target_envs, action } = parsed.data;

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  if (action === 'copy') {
    // Get source env var
    const { data: sourceVar } = await supabase
      .from('environment_variables')
      .select('*')
      .eq('project_id', project_id)
      .eq('key_name', key_name)
      .eq('environment', source_env)
      .single();

    if (!sourceVar) {
      return NextResponse.json({ error: '소스 환경변수를 찾을 수 없습니다' }, { status: 404 });
    }

    // Decrypt the source value
    let decryptedValue: string;
    try {
      decryptedValue = decrypt(sourceVar.encrypted_value);
    } catch {
      return NextResponse.json({ error: '소스 값 복호화 실패' }, { status: 500 });
    }

    const results = [];

    for (const targetEnv of target_envs) {
      if (targetEnv === source_env) continue;

      // Check if target already exists
      const { data: existingVar } = await supabase
        .from('environment_variables')
        .select('id')
        .eq('project_id', project_id)
        .eq('key_name', key_name)
        .eq('environment', targetEnv)
        .single();

      const encryptedValue = encrypt(decryptedValue);

      if (existingVar) {
        // Update existing
        const { error } = await supabase
          .from('environment_variables')
          .update({
            encrypted_value: encryptedValue,
            service_id: sourceVar.service_id,
            is_secret: sourceVar.is_secret,
            description: sourceVar.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingVar.id);

        results.push({ env: targetEnv, action: 'updated', error: error?.message || null });
      } else {
        // Insert new
        const { error } = await supabase
          .from('environment_variables')
          .insert({
            project_id,
            key_name,
            encrypted_value: encryptedValue,
            environment: targetEnv,
            is_secret: sourceVar.is_secret,
            service_id: sourceVar.service_id,
            description: sourceVar.description,
          });

        results.push({ env: targetEnv, action: 'created', error: error?.message || null });
      }

      // Trigger auto-sync for each target env
      triggerAutoSync(project_id, targetEnv, user.id).catch(() => {});
    }

    await logAudit(user.id, {
      action: 'env_var.conflict_resolve',
      resourceType: 'environment_variable',
      details: { key_name, source_env, target_envs, action: 'copy', results },
    });

    return NextResponse.json({ success: true, results });
  }

  if (action === 'delete') {
    const results = [];

    for (const targetEnv of target_envs) {
      const { error } = await supabase
        .from('environment_variables')
        .delete()
        .eq('project_id', project_id)
        .eq('key_name', key_name)
        .eq('environment', targetEnv);

      results.push({ env: targetEnv, action: 'deleted', error: error?.message || null });

      triggerAutoSync(project_id, targetEnv, user.id).catch(() => {});
    }

    await logAudit(user.id, {
      action: 'env_var.conflict_resolve',
      resourceType: 'environment_variable',
      details: { key_name, target_envs, action: 'delete', results },
    });

    return NextResponse.json({ success: true, results });
  }

  return NextResponse.json({ error: '지원하지 않는 액션' }, { status: 400 });
}
