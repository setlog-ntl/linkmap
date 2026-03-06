import { createClient } from '@/lib/supabase/server';
import { apiError } from './errors';

type TeamRole = 'admin' | 'editor' | 'viewer';

const ROLE_HIERARCHY: Record<TeamRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
};

/**
 * 팀 멤버의 역할을 확인하고 최소 역할 요건 충족 여부를 검증합니다.
 * 팀 소유자(owner)는 항상 admin으로 취급됩니다.
 *
 * @returns 멤버의 역할 또는 권한 부족 시 NextResponse 에러
 */
export async function requireTeamRole(
  teamId: string,
  userId: string,
  minimumRole: TeamRole,
): Promise<{ role: TeamRole } | Response> {
  const supabase = await createClient();

  // 팀 소유자 확인
  const { data: team } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single();

  if (!team) {
    return apiError('팀을 찾을 수 없습니다', 404);
  }

  // 소유자는 항상 admin
  if (team.owner_id === userId) {
    return { role: 'admin' };
  }

  // 멤버 역할 조회
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .single();

  if (!membership) {
    return apiError('팀 멤버가 아닙니다', 403);
  }

  const memberRole = membership.role as TeamRole;

  if (ROLE_HIERARCHY[memberRole] < ROLE_HIERARCHY[minimumRole]) {
    return apiError(`${minimumRole} 이상의 권한이 필요합니다`, 403);
  }

  return { role: memberRole };
}

/** requireTeamRole의 반환값이 에러 응답인지 확인 */
export function isTeamAuthError(result: { role: TeamRole } | Response): result is Response {
  return result instanceof Response;
}
