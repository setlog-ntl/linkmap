// GET /api/projects/[id]/services/[psId]/usage
// OpenAI 사용량 동기화 현황 조회

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';
import type { OpenAIUsageSummary } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; psId: string }> }
) {
  const { id, psId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!project) return notFoundError('프로젝트');

  // project_service 확인
  const { data: ps, error } = await supabase
    .from('project_services')
    .select(
      `id, actual_cost_monthly, usage_synced_at,
       service:services(id, slug)`
    )
    .eq('id', psId)
    .eq('project_id', id)
    .single();

  if (error || !ps) return notFoundError('프로젝트 서비스');

  type PsRow = {
    id: string;
    actual_cost_monthly: number | null;
    usage_synced_at: string | null;
    service: { id: string; slug: string } | null;
  };
  const typedPs = ps as unknown as PsRow;
  const serviceId = typedPs.service?.id;

  if (!serviceId) {
    return NextResponse.json({
      projectServiceId: psId,
      hasApiKey: false,
      maskedKey: null,
      periodStart: null,
      periodEnd: null,
      totalCost: null,
      syncedAt: null,
      byModel: [],
    } satisfies OpenAIUsageSummary & { maskedKey: null });
  }

  // service_accounts에서 OpenAI API Key 존재 여부 확인
  // 1순위: 프로젝트 레벨
  const { data: saProject } = await supabase
    .from('service_accounts')
    .select('id, api_key_label, encrypted_api_key')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .eq('service_id', serviceId)
    .eq('connection_type', 'api_key')
    .eq('status', 'active')
    .maybeSingle();

  // 2순위: 사용자 레벨 (project_id IS NULL)
  const { data: saUser } = !saProject
    ? await supabase
        .from('service_accounts')
        .select('id, api_key_label, encrypted_api_key')
        .is('project_id', null)
        .eq('user_id', user.id)
        .eq('service_id', serviceId)
        .eq('connection_type', 'api_key')
        .eq('status', 'active')
        .maybeSingle()
    : { data: null };

  const sa = saProject ?? saUser;
  const hasApiKey = !!(sa?.encrypted_api_key);
  const maskedKey = sa?.api_key_label ?? (hasApiKey ? '연결됨' : null);

  const summary: OpenAIUsageSummary & { maskedKey: string | null } = {
    projectServiceId: psId,
    hasApiKey,
    maskedKey,
    periodStart: null,
    periodEnd: null,
    totalCost: typedPs.actual_cost_monthly,
    syncedAt: typedPs.usage_synced_at,
    byModel: [],
  };

  return NextResponse.json(summary);
}
