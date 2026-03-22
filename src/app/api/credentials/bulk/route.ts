import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bulkUpdateCredentialSchema, bulkDeleteCredentialSchema } from '@/lib/validations/credential';
import { unauthorizedError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = bulkUpdateCredentialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { ids, purpose, environment, service_id } = parsed.data;

  // Verify ownership of all credentials
  const { data: creds, error: fetchError } = await supabase
    .from('service_credentials')
    .select('id, project_id, label, project:projects!inner(user_id)')
    .in('id', ids);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  const ownedIds = (creds || [])
    .filter((c) => (c.project as unknown as { user_id: string }).user_id === user.id)
    .map((c) => c.id);

  if (ownedIds.length === 0) {
    return NextResponse.json({ error: '수정 권한이 없습니다' }, { status: 403 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (purpose !== undefined) updates.purpose = purpose;
  if (environment !== undefined) updates.environment = environment;
  if (service_id !== undefined) updates.service_id = service_id;

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ error: '변경할 필드가 없습니다' }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from('service_credentials')
    .update(updates)
    .in('id', ownedIds);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'credential.bulk_update',
    resourceType: 'service_credential',
    resourceId: ownedIds.join(','),
    details: {
      count: ownedIds.length,
      updated_fields: Object.keys(updates).filter((k) => k !== 'updated_at'),
    },
  });

  return NextResponse.json({ success: true, count: ownedIds.length });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = bulkDeleteCredentialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { ids } = parsed.data;

  // Verify ownership
  const { data: creds, error: fetchError } = await supabase
    .from('service_credentials')
    .select('id, label, project:projects!inner(user_id)')
    .in('id', ids);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  const ownedIds = (creds || [])
    .filter((c) => (c.project as unknown as { user_id: string }).user_id === user.id)
    .map((c) => c.id);

  if (ownedIds.length === 0) {
    return NextResponse.json({ error: '삭제 권한이 없습니다' }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from('service_credentials')
    .delete()
    .in('id', ownedIds);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const labels = (creds || [])
    .filter((c) => ownedIds.includes(c.id))
    .map((c) => c.label);

  await logAudit(user.id, {
    action: 'credential.bulk_delete',
    resourceType: 'service_credential',
    resourceId: ownedIds.join(','),
    details: { count: ownedIds.length, labels },
  });

  return NextResponse.json({ success: true, count: ownedIds.length });
}
