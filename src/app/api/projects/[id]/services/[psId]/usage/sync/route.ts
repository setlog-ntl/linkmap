// POST /api/projects/[id]/services/[psId]/usage/sync
// OpenAI 실제 사용량 동기화 (당월 1일~오늘)

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
import { decrypt, encrypt } from '@/lib/crypto';
import { syncOpenAIUsageSchema } from '@/lib/validations/cost';
import {
  fetchOpenAIUsage,
  getCurrentMonthRange,
} from '@/lib/openai/usage';
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

  // 4. 비즈니스 로직 — API Key 확보
  let apiKey: string;
  let isNewKey = false;

  if (parsed.data.api_key) {
    // 요청 바디에 API Key가 포함된 경우 → 저장 후 사용
    apiKey = parsed.data.api_key;
    isNewKey = true;
  } else {
    // service_accounts에서 저장된 API Key 조회
    // 1순위: 프로젝트 레벨
    const { data: saProject } = await supabase
      .from('service_accounts')
      .select('id, encrypted_api_key')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .eq('service_id', serviceId)
      .eq('connection_type', 'api_key')
      .eq('status', 'active')
      .maybeSingle();

    // 2순위: 사용자 레벨
    const { data: saUser } = !saProject
      ? await supabase
          .from('service_accounts')
          .select('id, encrypted_api_key')
          .is('project_id', null)
          .eq('user_id', user.id)
          .eq('service_id', serviceId)
          .eq('connection_type', 'api_key')
          .eq('status', 'active')
          .maybeSingle()
      : { data: null };

    const sa = saProject ?? saUser;

    if (!sa?.encrypted_api_key) {
      return apiError(
        'OpenAI API Key가 연결되지 않았습니다. api_key를 요청에 포함하거나 설정에서 연결해주세요.',
        400
      );
    }

    try {
      apiKey = decrypt(sa.encrypted_api_key);
    } catch {
      return serverError('API Key 복호화에 실패했습니다');
    }
  }

  // 새 API Key 입력 시 service_accounts에 저장
  if (isNewKey) {
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

  // 5. OpenAI Usage API 호출
  const { start, end } = getCurrentMonthRange();

  let usageResult;
  try {
    usageResult = await fetchOpenAIUsage(apiKey, start, end);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'OpenAI API 호출 실패';
    return serverError(msg);
  }

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
