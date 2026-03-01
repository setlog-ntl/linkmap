import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProjectSchema } from '@/lib/validations/project';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !project) return notFoundError('프로젝트');

  return NextResponse.json(project);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) return notFoundError('프로젝트');

  const { data, error } = await supabase
    .from('projects')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return serverError(error.message);

  const updatedFields = Object.keys(parsed.data);
  const auditAction = updatedFields.includes('is_favorited')
    ? 'project.toggle_favorite'
    : updatedFields.includes('main_service_id')
      ? 'project.set_main_service'
      : updatedFields.includes('icon_type')
        ? 'project.set_icon'
        : updatedFields.includes('monthly_budget') || updatedFields.includes('budget_currency')
          ? 'project.budget_update'
          : 'project.update';
  await logAudit(user.id, {
    action: auditAction,
    resourceType: 'project',
    resourceId: id,
    details: updatedFields.includes('is_favorited')
      ? { is_favorited: parsed.data.is_favorited }
      : updatedFields.includes('main_service_id')
        ? { main_service_id: parsed.data.main_service_id }
        : updatedFields.includes('icon_type')
          ? { icon_type: parsed.data.icon_type, icon_value: parsed.data.icon_value }
          : { updated_fields: updatedFields },
  });

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: existing } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) return notFoundError('프로젝트');

  const { error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.delete',
    resourceType: 'project',
    resourceId: id,
    details: { name: existing.name },
  });

  return NextResponse.json({ success: true });
}
