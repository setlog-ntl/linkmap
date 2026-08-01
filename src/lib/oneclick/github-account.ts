/**
 * 원클릭 라우트 공용 — 사용자의 GitHub 계정을 골라 토큰까지 풀어준다.
 *
 * deploy / deploy-upload / repos / repo-analyze / deploy-repo가 같은 규칙을 쓴다:
 * user-level 계정(project_id NULL)을 우선하고, 명시된 계정 id가 있으면 그것만 본다.
 */
import type { createClient } from '@/lib/supabase/server';
import { safeDecryptToken } from '@/lib/github/token';

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface ResolvedGitHubAccount {
  accountId: string;
  projectId: string | null;
  token: string;
  scopes: string[] | null;
  serviceId: string;
}

export type GitHubAccountFailure =
  | { reason: 'service_missing' }
  | { reason: 'not_connected' }
  | { reason: 'token_invalid'; message: string };

export async function resolveOneclickGitHubAccount(
  supabase: SupabaseClient,
  userId: string,
  serviceAccountId?: string,
): Promise<ResolvedGitHubAccount | GitHubAccountFailure> {
  const { data: githubService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', 'github')
    .single();

  if (!githubService) return { reason: 'service_missing' };

  let query = supabase
    .from('service_accounts')
    .select('id, project_id, encrypted_access_token, oauth_scopes')
    .eq('user_id', userId)
    .eq('service_id', githubService.id)
    .eq('connection_type', 'oauth')
    .eq('status', 'active');

  if (serviceAccountId) query = query.eq('id', serviceAccountId);

  const { data: account } = await query
    .order('project_id', { ascending: true, nullsFirst: true })
    .limit(1)
    .single();

  if (!account) return { reason: 'not_connected' };

  const decrypted = await safeDecryptToken(account.encrypted_access_token, supabase, account.id);
  if ('error' in decrypted) return { reason: 'token_invalid', message: decrypted.error };

  return {
    accountId: account.id,
    projectId: account.project_id,
    token: decrypted.token,
    scopes: Array.isArray(account.oauth_scopes) ? account.oauth_scopes : null,
    serviceId: githubService.id,
  };
}

export function isGitHubAccountFailure(
  value: ResolvedGitHubAccount | GitHubAccountFailure,
): value is GitHubAccountFailure {
  return 'reason' in value;
}

/**
 * workflow 스코프 없이는 .github/workflows 푸시·Pages(Actions) 활성화가 불가능하다.
 * 레거시 연결은 oauth_scopes가 비어 있을 수 있어 그때는 검증을 건너뛴다(false-block 방지).
 */
export function missingWorkflowScope(scopes: string[] | null): boolean {
  return Array.isArray(scopes) && scopes.length > 0 && !scopes.includes('workflow');
}
