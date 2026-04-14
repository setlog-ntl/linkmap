import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export type TrashItemType = 'project' | 'env_var' | 'connection';

export interface TrashItem {
  id: string;
  type: TrashItemType;
  name: string;
  project_name?: string;
  project_id?: string;
  deleted_at: string;
}

type ProjectJoin = { name: string; user_id: string };

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const [projectsRes, envVarsRes, connectionsRes] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, deleted_at')
      .eq('user_id', user.id)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false }),

    supabase
      .from('environment_variables')
      .select('id, key_name, project_id, deleted_at, project:projects!inner(name, user_id)')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false }),

    supabase
      .from('user_connections')
      .select('id, project_id, source_service_id, target_service_id, deleted_at, project:projects!inner(name, user_id)')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false }),
  ]);

  if (projectsRes.error) return serverError(projectsRes.error.message);

  const items: TrashItem[] = [];

  for (const p of projectsRes.data ?? []) {
    items.push({
      id: p.id,
      type: 'project',
      name: p.name,
      deleted_at: p.deleted_at as string,
    });
  }

  for (const ev of envVarsRes.data ?? []) {
    const proj = (ev.project as unknown as ProjectJoin | null);
    if (!proj || proj.user_id !== user.id) continue;
    items.push({
      id: ev.id,
      type: 'env_var',
      name: ev.key_name,
      project_name: proj.name,
      project_id: ev.project_id,
      deleted_at: ev.deleted_at as string,
    });
  }

  for (const conn of connectionsRes.data ?? []) {
    const proj = (conn.project as unknown as ProjectJoin | null);
    if (!proj || proj.user_id !== user.id) continue;
    items.push({
      id: conn.id,
      type: 'connection',
      name: `${conn.source_service_id} → ${conn.target_service_id}`,
      project_name: proj.name,
      project_id: conn.project_id,
      deleted_at: conn.deleted_at as string,
    });
  }

  items.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

  return NextResponse.json({ items });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 사용자 프로젝트 ID 목록 조회
  const { data: userProjects } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', user.id);

  const projectIds = (userProjects ?? []).map((p) => p.id);

  // homepage_deploys → connections → env_vars → projects 순서로 영구 삭제
  if (projectIds.length > 0) {
    // 연결된 배포 기록 삭제 (원클릭배포 + 쇼케이스 동기화)
    const { error: deployError } = await supabase
      .from('homepage_deploys')
      .delete()
      .in('project_id', projectIds);

    if (deployError) return serverError(`배포 기록 삭제 실패: ${deployError.message}`);

    const { error: connError } = await supabase
      .from('user_connections')
      .delete()
      .in('project_id', projectIds)
      .not('deleted_at', 'is', null);

    if (connError) return serverError(`연결 삭제 실패: ${connError.message}`);

    const { error: envError } = await supabase
      .from('environment_variables')
      .delete()
      .in('project_id', projectIds)
      .not('deleted_at', 'is', null);

    if (envError) return serverError(`환경변수 삭제 실패: ${envError.message}`);
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('user_id', user.id)
    .not('deleted_at', 'is', null);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'trash.empty',
    resourceType: 'trash',
  });

  return NextResponse.json({ success: true });
}
