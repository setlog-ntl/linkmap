import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import type { DbEnvVarWithProject } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { success } = rateLimit(`decrypt:${user.id}`, 20);
  if (!success) return apiError('요청이 너무 많습니다.', 429);

  const { id } = await request.json();
  if (!id) {
    return apiError('환경변수 ID가 필요합니다', 400);
  }

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
