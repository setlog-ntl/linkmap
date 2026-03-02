// OpenAI Billing Usage API 클라이언트
// 서버 사이드 전용 (API route에서만 사용)
//
// 사용 엔드포인트: /dashboard/billing/usage
//   - 일반 사용자 API Key(sk-proj-...)로 접근 가능
//   - Admin Key 불필요
//   - 비용을 cents 단위로 직접 반환 (토큰 계산 불필요)
//   - /v1/organization/usage/completions 는 Admin Key 전용이므로 사용 불가

export interface OpenAIModelUsage {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface OpenAIUsageSummary {
  periodStart: string;
  periodEnd: string;
  totalCost: number;
  byModel: OpenAIModelUsage[];
}

interface BillingUsageResponse {
  total_usage: number; // cents
  daily_costs?: Array<{
    timestamp: number;
    line_items: Array<{
      name: string;
      cost: number; // cents
    }>;
  }>;
}

function formatDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * OpenAI Billing Usage API 호출
 * Endpoint: GET /dashboard/billing/usage?start_date=&end_date=
 * - 일반 API Key(sk-proj-...) 로 동작
 * - total_usage: 해당 기간 총 비용(cents)
 * - daily_costs[].line_items: 모델(카테고리)별 일별 비용
 */
export async function fetchOpenAIUsage(
  apiKey: string,
  periodStart: Date,
  periodEnd: Date
): Promise<OpenAIUsageSummary> {
  const startDate = formatDateParam(periodStart);
  // end_date는 exclusive이므로 +1일
  const endDate = formatDateParam(
    new Date(periodEnd.getFullYear(), periodEnd.getMonth(), periodEnd.getDate() + 1)
  );

  const url = new URL('https://api.openai.com/dashboard/billing/usage');
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      (body as { error?: { message?: string } | string }).error
        ? typeof (body as { error: unknown }).error === 'string'
          ? (body as { error: string }).error
          : ((body as { error: { message?: string } }).error.message ?? `OpenAI API 오류: ${res.status}`)
        : `OpenAI API 오류: ${res.status}`;
    throw new Error(msg);
  }

  const result = (await res.json()) as BillingUsageResponse;

  // 총 비용: cents → USD
  const totalCost = (result.total_usage ?? 0) / 100;

  // 모델(카테고리)별 집계
  const byModelMap = new Map<string, number>(); // name → cost (USD)
  for (const day of result.daily_costs ?? []) {
    for (const item of day.line_items ?? []) {
      if (item.cost > 0) {
        byModelMap.set(item.name, (byModelMap.get(item.name) ?? 0) + item.cost / 100);
      }
    }
  }

  const byModel: OpenAIModelUsage[] = Array.from(byModelMap.entries())
    .map(([name, cost]) => ({
      modelId: name,
      inputTokens: 0, // billing API는 토큰 분리 없이 비용만 제공
      outputTokens: 0,
      cost: Math.round(cost * 10000) / 10000,
    }))
    .sort((a, b) => b.cost - a.cost);

  return {
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    totalCost: Math.round(totalCost * 10000) / 10000,
    byModel,
  };
}

/** 당월 1일 ~ 오늘 범위 반환 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  return { start, end: now };
}
