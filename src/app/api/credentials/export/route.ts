import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { exportCredentialSchema } from '@/lib/validations/credential';
import { unauthorizedError, validationError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { logAudit } from '@/lib/audit';
import type { DbCredentialWithProject } from '@/lib/supabase/types';

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
    return NextResponse.json({ error: '유효하지 않은 JSON 형식입니다' }, { status: 400 });
  }

  const parsed = exportCredentialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, ids } = parsed.data;

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: '프로젝트 접근 권한이 없습니다' }, { status: 403 });
  }

  // Fetch credentials with ownership check
  const { data: creds, error: fetchError } = await supabase
    .from('service_credentials')
    .select('*, project:projects!inner(user_id)')
    .in('id', ids)
    .eq('project_id', project_id);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  const ownedCreds = (creds || []).filter(
    (c) => (c as unknown as DbCredentialWithProject).project.user_id === user.id
  ) as unknown as DbCredentialWithProject[];

  if (ownedCreds.length === 0) {
    return NextResponse.json({ error: '내보내기 가능한 자격증명이 없습니다' }, { status: 404 });
  }

  // Decrypt and build entries
  const entries = ownedCreds.map((cred) => ({
    label: cred.label,
    username: decrypt(cred.encrypted_username),
    password: cred.encrypted_password ? decrypt(cred.encrypted_password) : null,
    environment: cred.environment,
    service_id: cred.service_id,
    purpose: cred.purpose,
  }));

  await logAudit(user.id, {
    action: 'credential.export',
    resourceType: 'service_credential',
    resourceId: ownedCreds.map((c) => c.id).join(','),
    details: {
      count: ownedCreds.length,
      labels: ownedCreds.map((c) => c.label),
      project_id,
    },
  });

  return NextResponse.json({ entries });
}
