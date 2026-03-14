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

// TODO: 결제 시스템 연동 후 실제 한도로 복원
const DEFAULT_QUOTA: PlanQuota = {
  plan: 'free',
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
    .eq('status', 'active')
    .single();
  return (subscription?.plan as SubscriptionPlan) || 'free';
}

/** Pro 이상 플랜인지 확인
 *  TODO: 결제 시스템 연동 후 실제 플랜 체크로 복원 */
export async function isProOrAbove(_userId: string): Promise<boolean> {
  return true;
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

// TODO: 결제 시스템 연동 후 실제 쿼터 체크 로직 복원
// 현재는 모든 쿼터를 무제한으로 허용

/** 홈페이지 배포 쿼터 체크 — 현재 무제한 */
export async function checkHomepageDeployQuota(
  _userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  return { allowed: true, current: 0, max: 999999 };
}

/** 프로젝트 쿼터 체크 — 현재 무제한 */
export async function checkProjectQuota(
  _userId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  return { allowed: true, current: 0, max: 999999 };
}

/** 환경변수 쿼터 체크 — 현재 무제한 */
export async function checkEnvVarQuota(
  _userId: string,
  _projectId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  return { allowed: true, current: 0, max: 999999 };
}

/** 서비스 쿼터 체크 — 현재 무제한 */
export async function checkServiceQuota(
  _userId: string,
  _projectId: string,
): Promise<{ allowed: boolean; current: number; max: number }> {
  return { allowed: true, current: 0, max: 999999 };
}
