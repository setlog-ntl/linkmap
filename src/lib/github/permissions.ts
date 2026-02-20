import type { SupabaseClient } from '@supabase/supabase-js';

export type ProjectRole = 'owner' | 'admin' | 'editor' | 'viewer';

/**
 * Resolve a user's role in a project.
 * Returns 'owner' if user owns the project, or the team member role, or null.
 */
export async function resolveProjectRole(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
): Promise<ProjectRole | null> {
  // Check if user is the project owner
  const { data: project } = await supabase
    .from('projects')
    .select('user_id, team_id')
    .eq('id', projectId)
    .single();

  if (!project) return null;
  if (project.user_id === userId) return 'owner';

  // Check team membership
  if (project.team_id) {
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', project.team_id)
      .eq('user_id', userId)
      .single();

    if (member) return member.role as ProjectRole;
  }

  return null;
}

/**
 * Check if a role has at least the required permission level.
 * owner > admin > editor > viewer
 */
export function hasMinRole(role: ProjectRole | null, minRole: ProjectRole): boolean {
  if (!role) return false;
  const hierarchy: Record<ProjectRole, number> = {
    owner: 4,
    admin: 3,
    editor: 2,
    viewer: 1,
  };
  return hierarchy[role] >= hierarchy[minRole];
}
