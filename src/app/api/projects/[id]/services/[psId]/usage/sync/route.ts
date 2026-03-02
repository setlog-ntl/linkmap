// POST /api/projects/[id]/services/[psId]/usage/sync
// OpenAI 실제 사용량 동기화
// 브라우저에서 직접 OpenAI를 조회한 결과를 저장 (서버 측 Cloudflare 지역 제한 우회)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
  apiError,
} from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { encrypt } from '@/lib/crypto';
import { syncOpenAIUsageSchema } from '@/lib/validations/cost';
import type { OpenAIUsageSummary } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; psId: string }> }
) {
  const { id, psId } = await params;
  const supabase = await createClient();

  // 1. 인증
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod safeParse
  const body = await request.json().catch(() => ({}));
  const parsed = syncOpenAIUsageSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // usage_data 필수 — 서버에서 직접 OpenAI 호출 금지 (Cloudflare Workers 지역 제한)
  if (!parsed.data.usage_data) {
    return apiError(
      'usage_data가 필요합니다. 브라우저에서 직접 OpenAI 사용량을 조회한 후 전달해주세요.',
      400
    );
  }

  // 3. 소유권 확인
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!project) return notFoundError('프로젝트');

  const { data: ps, error: psError } = await supabase
    .from('project_services')
    .select(`id, service:services(id, slug)`)
    .eq('id', psId)
    .eq('project_id', id)
    .single();

  if (psError || !ps) return notFoundError('프로젝트 서비스');

  type PsRow = { id: string; service: { id: string; slug: string } | null };
  const typedPs = ps as unknown as PsRow;
  const serviceId = typedPs.service?.id;
  const serviceSlug = typedPs.service?.slug;

  if (!serviceId) return serverError('서비스 정보를 찾을 수 없습니다');

  // 4. API Key 저장 (요청에 포함된 경우만 — 저장 목적, OpenAI 호출에는 사용 안 함)
  if (parsed.data.api_key) {
    const apiKey = parsed.data.api_key;
    const encryptedKey = encrypt(apiKey);
    const label = `${apiKey.substring(0, 12)}••••`;

    // partial unique index: (user_id, service_id) WHERE project_id IS NULL AND multi_account_provider = false
    // → upsert 대신 select → update/insert
    const { data: existing } = await supabase
      .from('service_accounts')
      .select('id')
      .is('project_id', null)
      .eq('user_id', user.id)
      .eq('service_id', serviceId)
      .eq('multi_account_provider', false)
      .maybeSingle();

    if (existing) {
      const { error: updateErr } = await supabase
        .from('service_accounts')
        .update({
          connection_type: 'api_key',
          encrypted_api_key: encryptedKey,
          api_key_label: label,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateErr) return serverError('API Key 업데이트 실패: ' + updateErr.message);
    } else {
      const { error: insertErr } = await supabase
        .from('service_accounts')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          project_id: null,
          connection_type: 'api_key',
          encrypted_api_key: encryptedKey,
          api_key_label: label,
          status: 'active',
          multi_account_provider: false,
        });

      if (insertErr) return serverError('API Key 저장 실패: ' + insertErr.message);
    }

    await logAudit(user.id, {
      action: 'service_cost.api_key_save',
      resourceType: 'service_account',
      resourceId: psId,
      details: { project_id: id, service_slug: serviceSlug },
    });
  }

  // 5. 브라우저에서 전달받은 사용량 데이터 사용 (usage_data 필수 여부는 step 2에서 확인)
  const ud = parsed.data.usage_data!;
  const usageResult = {
    totalCost: ud.total_cost,
    periodStart: ud.period_start,
    periodEnd: ud.period_end,
    byModel: ud.by_model,
  };

  // 6. project_services 업데이트 (actual_cost_monthly, usage_synced_at)
  const { error: updateError } = await supabase
    .from('project_services')
    .update({
      actual_cost_monthly: usageResult.totalCost,
      usage_synced_at: new Date().toISOString(),
      billing_cycle: 'usage_based',
      updated_at: new Date().toISOString(),
    })
    .eq('id', psId);

  if (updateError) return serverError(updateError.message);

  // 7. logAudit
  await logAudit(user.id, {
    action: 'service_cost.usage_sync',
    resourceType: 'project_service',
    resourceId: psId,
    details: {
      project_id: id,
      service_slug: serviceSlug,
      total_cost: usageResult.totalCost,
      period_start: usageResult.periodStart,
      period_end: usageResult.periodEnd,
      model_count: usageResult.byModel.length,
    },
  });

  const response: OpenAIUsageSummary = {
    projectServiceId: psId,
    hasApiKey: true,
    periodStart: usageResult.periodStart,
    periodEnd: usageResult.periodEnd,
    totalCost: usageResult.totalCost,
    syncedAt: new Date().toISOString(),
    byModel: usageResult.byModel,
  };

  return NextResponse.json(response);
}
