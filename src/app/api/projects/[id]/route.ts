import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProjectSchema } from '@/lib/validations/project';
import { apiError, unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
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

  // 프로젝트 이름 변경 시 연결된 homepage_deploys의 site_name도 동기화
  if (parsed.data.name) {
    const newSiteName = parsed.data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 100);
    if (newSiteName.length >= 2) {
      await supabase
        .from('homepage_deploys')
        .update({ site_name: newSiteName })
        .eq('project_id', id)
        .eq('user_id', user.id);
    }
  }

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

  // 1) 본인 소유 프로젝트 확인
  const { data: ownProject } = await supabase
    .from('projects')
    .select('id, name, user_id, team_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  // 2) 본인 소유 아닌 경우 → 팀 프로젝트 권한 확인
  if (!ownProject) {
    // RLS를 통해 조회 가능한 프로젝트인지 (팀 멤버로서 볼 수 있는 프로젝트)
    const { data: teamProject } = await supabase
      .from('projects')
      .select('id, name, user_id, team_id')
      .eq('id', id)
      .single();

    if (!teamProject) return notFoundError('프로젝트');

    // 팀 프로젝트이면 팀 관리자/소유자 권한 확인
    if (teamProject.team_id) {
      const { data: membership } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamProject.team_id)
        .eq('user_id', user.id)
        .single();

      const { data: team } = await supabase
        .from('teams')
        .select('owner_id')
        .eq('id', teamProject.team_id)
        .single();

      const isTeamOwner = team?.owner_id === user.id;
      const isTeamAdmin = membership?.role === 'admin';

      if (!isTeamOwner && !isTeamAdmin) {
        return apiError('이 프로젝트를 삭제할 권한이 없습니다', 403);
      }

      // 팀 관리자/소유자 → 삭제 진행 (프로젝트 소유자의 deploys도 정리)
      await supabase
        .from('homepage_deploys')
        .delete()
        .eq('project_id', id)
        .eq('user_id', teamProject.user_id);

      const { error } = await supabase
        .from('projects')
        .update({ deleted_at: new Date().toISOString(), is_showcase: false })
        .eq('id', id);
      if (error) return serverError(error.message);

      await logAudit(user.id, {
        action: 'project.delete',
        resourceType: 'project',
        resourceId: id,
        details: { name: teamProject.name, team_id: teamProject.team_id },
      });

      return NextResponse.json({ success: true });
    }

    // 팀 프로젝트가 아닌데 본인 소유도 아님
    return apiError('이 프로젝트를 삭제할 권한이 없습니다', 403);
  }

  // 3) 본인 소유 프로젝트 삭제
  await supabase
    .from('homepage_deploys')
    .delete()
    .eq('project_id', id)
    .eq('user_id', user.id);

  const { error } = await supabase
    .from('projects')
    .update({ deleted_at: new Date().toISOString(), is_showcase: false })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'project.delete',
    resourceType: 'project',
    resourceId: id,
    details: { name: ownProject.name },
  });

  return NextResponse.json({ success: true });
}
