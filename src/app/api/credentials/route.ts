import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';
import { createCredentialSchema, updateCredentialSchema } from '@/lib/validations/credential';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import type { DbCredentialWithProject } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  if (!projectId) {
    return NextResponse.json({ error: '프로젝트 ID가 필요합니다' }, { status: 400 });
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const { data, error } = await supabase
    .from('service_credentials')
    .select('*')
    .eq('project_id', projectId)
    .order('label');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createCredentialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, service_id, label, username, password, purpose, environment, website_url, notes } = parsed.data;

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const encrypted_username = encrypt(username);
  const encrypted_password = password ? encrypt(password) : null;

  const { data, error } = await supabase
    .from('service_credentials')
    .insert({
      project_id,
      service_id: service_id || null,
      label,
      encrypted_username,
      encrypted_password,
      purpose,
      environment,
      website_url: website_url || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'credential.create',
    resourceType: 'service_credential',
    resourceId: data.id,
    details: { label, project_id, purpose },
  });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateCredentialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { id, label, username, password, purpose, environment, service_id, website_url, notes } = parsed.data;

  const { data: cred } = await supabase
    .from('service_credentials')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const credTyped = cred as DbCredentialWithProject | null;
  if (!credTyped || credTyped.project.user_id !== user.id) {
    return notFoundError('계정 정보');
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (label !== undefined) updates.label = label;
  if (username !== undefined) updates.encrypted_username = encrypt(username);
  if (password !== undefined) updates.encrypted_password = password ? encrypt(password) : null;
  if (purpose !== undefined) updates.purpose = purpose;
  if (environment !== undefined) updates.environment = environment;
  if (service_id !== undefined) updates.service_id = service_id;
  if (website_url !== undefined) updates.website_url = website_url;
  if (notes !== undefined) updates.notes = notes;

  const { data, error } = await supabase
    .from('service_credentials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'credential.update',
    resourceType: 'service_credential',
    resourceId: id,
    details: { updated_fields: Object.keys(updates).filter(k => k !== 'updated_at') },
  });

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

  const { data: cred } = await supabase
    .from('service_credentials')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const credTyped = cred as DbCredentialWithProject | null;
  if (!credTyped || credTyped.project.user_id !== user.id) {
    return notFoundError('계정 정보');
  }

  const { error } = await supabase
    .from('service_credentials')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'credential.delete',
    resourceType: 'service_credential',
    resourceId: id,
    details: { label: credTyped.label },
  });

  return NextResponse.json({ success: true });
}
