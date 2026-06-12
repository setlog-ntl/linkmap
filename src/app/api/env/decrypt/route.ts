import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';
import type { DbEnvVarWithProject } from '@/lib/supabase/types';

const decryptRequestSchema = z.union([
  z.object({ id: z.string().uuid('유효한 환경변수 ID가 필요합니다') }),
  z.object({ ids: z.array(z.string().uuid()).min(1).max(200) }),
]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const mfaResponse = await requireMfa(supabase);
  if (mfaResponse) return mfaResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('유효하지 않은 JSON 형식입니다', 400);
  }

  const parsed = decryptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('유효한 환경변수 ID가 필요합니다', 400);
  }

  // ── 일괄 복호화 (전체 보기/전체 복사용) ──
  if ('ids' in parsed.data) {
    const { ids } = parsed.data;

    const { data: envVars } = await supabase
      .from('environment_variables')
      .select('id, key_name, encrypted_value, project_id, project:projects!inner(user_id)')
      .in('id', ids)
      .is('deleted_at', null);

    const owned = ((envVars ?? []) as unknown as Pick<DbEnvVarWithProject, 'id' | 'key_name' | 'encrypted_value' | 'project_id' | 'project'>[])
      .filter((v) => v.project.user_id === user.id);

    if (owned.length === 0) return notFoundError('환경변수');

    const values: Record<string, string> = {};
    for (const v of owned) {
      try {
        values[v.id] = decrypt(v.encrypted_value);
      } catch {
        // 손상된 값은 응답에서 제외 (나머지 복호화는 계속)
      }
    }

    await logAudit(user.id, {
      action: 'env_var.bulk_decrypt',
      resourceType: 'environment_variable',
      resourceId: owned[0].project_id,
      details: { count: owned.length, key_names: owned.map((v) => v.key_name) },
    });

    return NextResponse.json({ values });
  }

  // ── 단건 복호화 ──
  const { id } = parsed.data;

  const { data: envVar } = await supabase
    .from('environment_variables')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const envVarTyped = envVar as DbEnvVarWithProject | null;
  if (!envVarTyped || envVarTyped.project.user_id !== user.id) {
    return notFoundError('환경변수');
  }

  const decryptedValue = decrypt(envVarTyped.encrypted_value);

  await logAudit(user.id, {
    action: 'env_var.decrypt',
    resourceType: 'environment_variable',
    resourceId: id,
    details: { key_name: envVarTyped.key_name },
  });

  return NextResponse.json({ value: decryptedValue });
}
