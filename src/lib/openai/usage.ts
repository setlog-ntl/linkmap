// OpenAI Usage API 클라이언트 + 모델별 단가 테이블
// 서버 사이드 전용 (API route에서만 사용)
// 참고: https://platform.openai.com/docs/api-reference/usage

/** 모델별 단가 (USD per 1M tokens, 2025년 기준) */
const OPENAI_PRICING: Record<
  string,
  { input: number; output: number; unit: number }
> = {
  // GPT-4o 계열
  'gpt-4o': { input: 2.5, output: 10.0, unit: 1_000_000 },
  'gpt-4o-2024-11-20': { input: 2.5, output: 10.0, unit: 1_000_000 },
  'gpt-4o-2024-08-06': { input: 2.5, output: 10.0, unit: 1_000_000 },
  'gpt-4o-mini': { input: 0.15, output: 0.6, unit: 1_000_000 },
  'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.6, unit: 1_000_000 },
  // GPT-4 계열
  'gpt-4-turbo': { input: 10.0, output: 30.0, unit: 1_000_000 },
  'gpt-4-turbo-2024-04-09': { input: 10.0, output: 30.0, unit: 1_000_000 },
  'gpt-4': { input: 30.0, output: 60.0, unit: 1_000_000 },
  'gpt-4-32k': { input: 60.0, output: 120.0, unit: 1_000_000 },
  // GPT-3.5 계열
  'gpt-3.5-turbo': { input: 0.5, output: 1.5, unit: 1_000_000 },
  'gpt-3.5-turbo-0125': { input: 0.5, output: 1.5, unit: 1_000_000 },
  // o1 계열 (reasoning)
  'o1': { input: 15.0, output: 60.0, unit: 1_000_000 },
  'o1-mini': { input: 3.0, output: 12.0, unit: 1_000_000 },
  'o1-preview': { input: 15.0, output: 60.0, unit: 1_000_000 },
  'o3-mini': { input: 1.1, output: 4.4, unit: 1_000_000 },
  // Embeddings
  'text-embedding-3-small': { input: 0.02, output: 0, unit: 1_000_000 },
  'text-embedding-3-large': { input: 0.13, output: 0, unit: 1_000_000 },
  'text-embedding-ada-002': { input: 0.1, output: 0, unit: 1_000_000 },
};

export interface OpenAIModelUsage {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface OpenAIUsageSummary {
  periodStart: string; // ISO date
  periodEnd: string;   // ISO date
  totalCost: number;
  byModel: OpenAIModelUsage[];
}

/** 모델명으로 단가 조회 (접두사 매칭 포함) */
function getPricing(modelId: string) {
  if (OPENAI_PRICING[modelId]) return OPENAI_PRICING[modelId];
  // 접두사로 매칭 (예: 'gpt-4o-2024-xx' → 'gpt-4o')
  const key = Object.keys(OPENAI_PRICING).find((k) =>
    modelId.startsWith(k) || k.startsWith(modelId)
  );
  return key ? OPENAI_PRICING[key] : null;
}

/** 비용 계산 */
function calcCost(
  pricing: { input: number; output: number; unit: number },
  inputTokens: number,
  outputTokens: number
): number {
  return (
    (inputTokens * pricing.input + outputTokens * pricing.output) /
    pricing.unit
  );
}

interface CompletionsUsageResult {
  object: string;
  data: Array<{
    aggregation_timestamp: number;
    model_id: string;
    input_tokens: number;
    output_tokens: number;
  }>;
  has_more: boolean;
  next_page?: string;
}

/**
 * OpenAI Organization Usage API 호출 (당월 1일~오늘)
 * Endpoint: GET /v1/organization/usage/completions
 */
export async function fetchOpenAIUsage(
  apiKey: string,
  periodStart: Date,
  periodEnd: Date
): Promise<OpenAIUsageSummary> {
  const startTs = Math.floor(periodStart.getTime() / 1000);
  const endTs = Math.floor(periodEnd.getTime() / 1000);

  const url = new URL('https://api.openai.com/v1/organization/usage/completions');
  url.searchParams.set('start_time', String(startTs));
  url.searchParams.set('end_time', String(endTs));
  url.searchParams.set('limit', '180'); // 최대 180 버킷

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg =
      (body as { error?: { message?: string } }).error?.message ??
      `OpenAI API 오류: ${res.status}`;
    throw new Error(msg);
  }

  const result = (await res.json()) as CompletionsUsageResult;

  // 모델별 집계
  const byModelMap = new Map<
    string,
    { inputTokens: number; outputTokens: number }
  >();

  for (const row of result.data) {
    const existing = byModelMap.get(row.model_id) ?? {
      inputTokens: 0,
      outputTokens: 0,
    };
    byModelMap.set(row.model_id, {
      inputTokens: existing.inputTokens + (row.input_tokens ?? 0),
      outputTokens: existing.outputTokens + (row.output_tokens ?? 0),
    });
  }

  let totalCost = 0;
  const byModel: OpenAIModelUsage[] = [];

  for (const [modelId, usage] of byModelMap.entries()) {
    const pricing = getPricing(modelId);
    const cost = pricing
      ? calcCost(pricing, usage.inputTokens, usage.outputTokens)
      : 0;

    totalCost += cost;
    byModel.push({
      modelId,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      cost,
    });
  }

  // 비용 내림차순 정렬
  byModel.sort((a, b) => b.cost - a.cost);

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
