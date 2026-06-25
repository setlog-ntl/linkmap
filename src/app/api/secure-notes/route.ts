import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';
import { createSecureNoteSchema, updateSecureNoteSchema } from '@/lib/validations/secure-note';
import { unauthorizedError, notFoundError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import type { DbSecureNoteWithProject } from '@/lib/supabase/types';

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
    .from('secure_notes')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false });

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
  const parsed = createSecureNoteSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { project_id, service_id, title, category, content, environment, notes } = parsed.data;

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const { data, error } = await supabase
    .from('secure_notes')
    .insert({
      project_id,
      service_id: service_id || null,
      title,
      category,
      encrypted_content: encrypt(content),
      environment,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'secure_note.create',
    resourceType: 'secure_note',
    resourceId: data.id,
    details: { title, project_id, category },
  });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateSecureNoteSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { id, title, category, content, environment, service_id, notes } = parsed.data;

  const { data: note } = await supabase
    .from('secure_notes')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const noteTyped = note as DbSecureNoteWithProject | null;
  if (!noteTyped || noteTyped.project.user_id !== user.id) {
    return notFoundError('보안 메모');
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (category !== undefined) updates.category = category;
  if (content !== undefined) updates.encrypted_content = encrypt(content);
  if (environment !== undefined) updates.environment = environment;
  if (service_id !== undefined) updates.service_id = service_id;
  if (notes !== undefined) updates.notes = notes;

  const { data, error } = await supabase
    .from('secure_notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'secure_note.update',
    resourceType: 'secure_note',
    resourceId: id,
    details: { updated_fields: Object.keys(updates).filter((k) => k !== 'updated_at') },
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

  const { data: note } = await supabase
    .from('secure_notes')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const noteTyped = note as DbSecureNoteWithProject | null;
  if (!noteTyped || noteTyped.project.user_id !== user.id) {
    return notFoundError('보안 메모');
  }

  const { error } = await supabase
    .from('secure_notes')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAudit(user.id, {
    action: 'secure_note.delete',
    resourceType: 'secure_note',
    resourceId: id,
    details: { title: noteTyped.title },
  });

  return NextResponse.json({ success: true });
}
