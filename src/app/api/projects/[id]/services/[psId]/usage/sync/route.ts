// POST /api/projects/[id]/services/[psId]/usage/sync
// OpenAI 실제 사용량 동기화
// 흐름: 브라우저 → Next.js 라우트(인증) → Supabase Edge Function(service_role) → OpenAI

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

type CostsResponse = {
  data?: Array<{
    results?: Array<{
      amount?: { value?: number };
      line_item?: string;
    }>;
  }>;
};

async function fetchCostsViaEdgeFunction(
  apiKey: string,
  startTime: number,
  endTime: number
): Promise<{ totalCost: number; periodStart: string; periodEnd: string; byModel: { modelId: string; cost: number; inputTokens: number; outputTokens: number }[] }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다');
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/openai-costs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ api_key: apiKey, start_time: startTime, end_time: endTime }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `OpenAI 비용 조회 실패 (${res.status})`);
  }

  const data = (await res.json()) as CostsResponse;

  let totalCost = 0;
  const byLineItemMap = new Map<string, number>();
  for (const bucket of data.data ?? []) {
    for (const result of bucket.results ?? []) {
      const value = result.amount?.value ?? 0;
      totalCost += value;
      const key = result.line_item ?? 'Other';
      byLineItemMap.set(key, (byLineItemMap.get(key) ?? 0) + value);
    }
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    totalCost: Math.round(totalCost * 10000) / 10000,
    periodStart: startOfMonth.toISOString(),
    periodEnd: now.toISOString(),
    byModel: Array.from(byLineItemMap.entries()).map(([modelId, cost]) => ({
      modelId,
      cost: Math.round(cost * 10000) / 10000,
      inputTokens: 0,
      outputTokens: 0,
    })),
  };
}

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

  // api_key 또는 usage_data 중 하나는 필수
  if (!parsed.data.api_key && !parsed.data.usage_data) {
    return apiError('api_key 또는 usage_data가 필요합니다.', 400);
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

  // 4. API Key 저장 (요청에 포함된 경우만)
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

  // 5. 사용량 데이터 확보
  // usage_data가 있으면 바로 사용, 없으면 Supabase Edge Function 경유로 OpenAI 조회
  let usageResult: {
    totalCost: number;
    periodStart: string;
    periodEnd: string;
    byModel: { modelId: string; cost: number; inputTokens: number; outputTokens: number }[];
  };

  if (parsed.data.usage_data) {
    const ud = parsed.data.usage_data;
    usageResult = {
      totalCost: ud.total_cost,
      periodStart: ud.period_start,
      periodEnd: ud.period_end,
      byModel: ud.by_model,
    };
  } else {
    // api_key만 있는 경우 → Supabase Edge Function 경유 (지역 제한 우회)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTime = Math.floor(startOfMonth.getTime() / 1000);
    const endTime = Math.floor(now.getTime() / 1000);

    try {
      usageResult = await fetchCostsViaEdgeFunction(parsed.data.api_key!, startTime, endTime);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'OpenAI 비용 조회 실패';
      return serverError(msg);
    }
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
