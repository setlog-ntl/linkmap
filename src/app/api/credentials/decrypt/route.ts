import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';
import type { DbCredentialWithProject } from '@/lib/supabase/types';

const decryptRequestSchema = z.object({
  id: z.string().uuid('유효한 계정 정보 ID가 필요합니다'),
  field: z.enum(['username', 'password', 'both']).default('both'),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('유효하지 않은 JSON 형식입니다', 400);
  }

  const parsed = decryptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  const { id, field } = parsed.data;

  const { data: cred } = await supabase
    .from('service_credentials')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const credTyped = cred as DbCredentialWithProject | null;
  if (!credTyped || credTyped.project.user_id !== user.id) {
    return notFoundError('계정 정보');
  }

  const result: Record<string, string | null> = {};
  if (field === 'username' || field === 'both') {
    result.username = decrypt(credTyped.encrypted_username);
  }
  if (field === 'password' || field === 'both') {
    result.password = credTyped.encrypted_password ? decrypt(credTyped.encrypted_password) : null;
  }

  await logAudit(user.id, {
    action: 'credential.decrypt',
    resourceType: 'service_credential',
    resourceId: id,
    details: { label: credTyped.label, field },
  });

  return NextResponse.json(result);
}
