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
    const proj = ev.project as { name: string; user_id: string } | null;
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
    const proj = conn.project as { name: string; user_id: string } | null;
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

  // deleted_at DESC 전체 정렬
  items.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

  return NextResponse.json({ items });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // connections → env_vars → projects 순서로 삭제
  const [connRes, envRes, projRes] = await Promise.all([
    supabase
      .from('user_connections')
      .delete()
      .in(
        'project_id',
        supabase.from('projects').select('id').eq('user_id', user.id)
      )
      .not('deleted_at', 'is', null),

    supabase
      .from('environment_variables')
      .delete()
      .in(
        'project_id',
        supabase.from('projects').select('id').eq('user_id', user.id)
      )
      .not('deleted_at', 'is', null),

    supabase
      .from('projects')
      .delete()
      .eq('user_id', user.id)
      .not('deleted_at', 'is', null),
  ]);

  if (projRes.error) return serverError(projRes.error.message);

  await logAudit(user.id, {
    action: 'trash.empty',
    resourceType: 'trash',
    details: {
      connection_errors: connRes.error?.message ?? null,
      env_var_errors: envRes.error?.message ?? null,
    },
  });

  return NextResponse.json({ success: true });
}
