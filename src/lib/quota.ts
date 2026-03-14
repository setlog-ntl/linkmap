import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
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

/** 관리자 무제한 쿼터 */
const UNLIMITED_QUOTA: PlanQuota = {
  plan: 'admin',
  max_projects: 999999,
  max_env_vars_per_project: 999999,
  max_services_per_project: 999999,
  max_team_members: 999999,
  max_homepage_deploys: 999999,
};

/** 사용자의 활성 구독 플랜을 반환 (없으면 'free') */
export async function getUserPlan(userId: string): Promise<SubscriptionPlan> {
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();
  return (subscription?.plan as SubscriptionPlan) || 'free';
}

/** Pro 이상 플랜인지 확인 (trialing도 Pro로 인정, 관리자는 항상 true) */
export async function isProOrAbove(userId: string): Promise<boolean> {
  if (await isAdmin(userId)) return true;
  const plan = await getUserPlan(userId);
  return plan === 'pro' || plan === 'team';
}

export async function getUserQuota(userId: string): Promise<PlanQuota> {
  if (await isAdmin(userId)) return UNLIMITED_QUOTA;

  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();

  const plan = subscription?.plan || 'free';

  const { data: quota } = await supabase
    .from('plan_quotas')
    .select('*')
    .eq('plan', plan)
    .single();

  return (quota as PlanQuota) || DEFAULT_QUOTA;
}

/** 홈페이지 배포 쿼터 체크 */
export async function checkHomepageDeployQuota(
  userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();
  const quota = await getUserQuota(userId);

  const { count } = await supabase
    .from('homepage_deploys')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;
  return { allowed: current < quota.max_homepage_deploys, current, max: quota.max_homepage_deploys };
}

/** 프로젝트 쿼터 체크 */
export async function checkProjectQuota(
  userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();
  const quota = await getUserQuota(userId);

  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;
  return { allowed: current < quota.max_projects, current, max: quota.max_projects };
}

/** 환경변수 쿼터 체크 */
export async function checkEnvVarQuota(
  userId: string,
  projectId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  const supabase = await createClient();
  const quota = await getUserQuota(userId);

  const { count } = await supabase
    .from('environment_variables')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  const current = count ?? 0;
  return { allowed: current < quota.max_env_vars_per_project, current, max: quota.max_env_vars_per_project };
}

/** 서비스 쿼터 체크 */
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

  const current = count ?? 0;
  return { allowed: current < quota.max_services_per_project, current, max: quota.max_services_per_project };
}
