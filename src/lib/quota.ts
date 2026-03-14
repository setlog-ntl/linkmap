import { createClient } from '@/lib/supabase/server';
import type { SubscriptionPlan } from '@/types';

export interface PlanQuota {
  plan: string;
  max_projects: number;
  max_env_vars_per_project: number;
  max_services_per_project: number;
  max_team_members: number;
  max_homepage_deploys: number;
}

const DEFAULT_QUOTA: PlanQuota = {
  plan: 'free',
  max_projects: 3,
  max_env_vars_per_project: 20,
  max_services_per_project: 10,
  max_team_members: 0,
  max_homepage_deploys: 3,
};

/** 사용자의 활성 구독 플랜을 반환 (없으면 'free') */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  return (subscription?.plan as SubscriptionPlan) || 'free';
}

/** Pro 이상 플랜인지 확인 */
export async function isProOrAbove(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan === 'pro' || plan === 'team';
}

export async function getUserQuota(userId: string): Promise<PlanQuota> {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const plan = subscription?.plan || 'free';

  const { data: quota } = await supabase
    .from('plan_quotas')
    .select('*')
    .eq('plan', plan)
    .single();

  return (quota as PlanQuota) || DEFAULT_QUOTA;
}

/** Atomically checks homepage deploy quota using a DB-level advisory lock.
 *  Falls back to the legacy two-query approach if the RPC is unavailable. */
export async function checkHomepageDeployQuota(
  userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('check_homepage_deploy_quota', {
    p_user_id: userId,
  });

  if (!error && data) {
    const result = data as { allowed: boolean; current: number; max: number };
    return result;
  }

  // Fallback: legacy two-query approach (used before migration 052 is applied)
  const quota = await getUserQuota(userId);
  const { count } = await supabase
    .from('homepage_deploys')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    allowed: (count || 0) < quota.max_homepage_deploys,
    current: count || 0,
    max: quota.max_homepage_deploys,
  };
}

/** Atomically checks project quota using a DB-level advisory lock.
 *  Falls back to the legacy two-query approach if the RPC is unavailable. */
export async function checkProjectQuota(
  userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('check_project_quota', {
    p_user_id: userId,
  });

  if (!error && data) {
    const result = data as { allowed: boolean; current: number; max: number };
    return result;
  }

  // Fallback: legacy two-query approach
  const quota = await getUserQuota(userId);
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    allowed: (count || 0) < quota.max_projects,
    current: count || 0,
    max: quota.max_projects,
  };
}

/** 프로젝트 내 환경변수 개수 쿼터 체크 */
export async function checkEnvVarQuota(
  userId: string,
  projectId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();
  const quota = await getUserQuota(userId);

  const { count } = await supabase
    .from('environment_variables')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .is('deleted_at', null);

  return {
    allowed: (count || 0) < quota.max_env_vars_per_project,
    current: count || 0,
    max: quota.max_env_vars_per_project,
  };
}

/** 프로젝트 내 서비스 개수 쿼터 체크 */
export async function checkServiceQuota(
  userId: string,
  projectId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();
  const quota = await getUserQuota(userId);

  const { count } = await supabase
    .from('project_services')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  return {
    allowed: (count || 0) < quota.max_services_per_project,
    current: count || 0,
    max: quota.max_services_per_project,
  };
}
