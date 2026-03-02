import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  unauthorizedError,
  validationError,
  notFoundError,
  serverError,
} from '@/lib/api/errors';
import {
  costReportSchema,
  COST_REPORT_JSON_SCHEMA,
  type CostReportResult,
} from '@/lib/validations/ai-cost-report';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIWithTools, callOpenAIStructured, type ToolDefinition } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';

// ─── Tool definitions ─────────────────────────────────────────────────────────

const tools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_project_cost_breakdown',
      description: 'Get detailed cost breakdown for a project including all services, tiers, and amounts',
      parameters: {
        type: 'object',
        properties: {
          project_id: { type: 'string', description: 'The project UUID' },
        },
        required: ['project_id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_service_alternatives',
      description: 'Get alternative services in the same category with pricing info',
      parameters: {
        type: 'object',
        properties: {
          service_slug: { type: 'string', description: 'Current service slug' },
          category: { type: 'string', description: 'Service category to search alternatives in' },
        },
        required: ['service_slug', 'category'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_industry_benchmarks',
      description: 'Get industry benchmark data for SaaS cost optimization',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
];

// ─── Industry benchmark data ─────────────────────────────────────────────────

const INDUSTRY_BENCHMARKS = {
  avg_saas_spend_per_employee_monthly_usd: 200,
  avg_startup_saas_tools_count: 8,
  typical_cost_reduction_by_category: {
    database: '무료 티어 활용 시 40~60% 절감 가능',
    monitoring: '오픈소스 대안(Grafana/Prometheus)으로 80% 절감 가능',
    communication: '통합 플랫폼 전환 시 30~50% 절감 가능',
    email: '발송량 기준 요금제로 전환 시 20~40% 절감 가능',
    ci_cd: '자체 호스팅 전환 시 50~70% 절감 가능',
    cloud_provider: '리저브드 인스턴스로 30~60% 절감 가능',
  },
  trends_2024: [
    '사용량 기반(Usage-Based) 과금 모델이 SaaS 시장 주류로 자리잡음',
    'AI 기능 번들링으로 기존 서비스 단가 20~40% 인상 추세',
    '스타트업 대상 무료/저가 티어 경쟁 심화로 협상 여지 증가',
    '연간 선결제 vs 월간 결제 차이 20~40%로 확대 중',
    '멀티클라우드 전략으로 벤더 종속성 해소 움직임 확산',
  ],
  optimization_tips: [
    '미사용 시트(seat) 정기 감사 — 평균 30% 유휴 시트 발견',
    '연간 계약 전환 — 평균 20~30% 할인',
    '스타트업 프로그램 신청 — 주요 SaaS 50~80% 크레딧 제공',
    '통합 가능한 서비스 묶기 — 중복 기능 제거',
    '사용량 모니터링 설정 — 과도 사용 조기 감지',
  ],
};

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    // 2. Validation
    const body = await request.json();
    const parsed = costReportSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { project_id } = parsed.data;

    // 3. Ownership check
    const { data: project } = await supabase
      .from('projects')
      .select('id, name, monthly_budget, budget_currency')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (!project) return notFoundError('프로젝트');

    // 4. Resolve OpenAI key
    const { apiKey, baseUrl } = await resolveOpenAIKey();

    // ── Pre-load data for tool executor ──────────────────────────────────────
    const { data: rawProjectServices } = await supabase
      .from('project_services')
      .select(
        `id, service_id, cost_tier_id, custom_cost_monthly, custom_cost_yearly,
         cost_notes, billing_cycle, actual_cost_monthly,
         service:services(id, name, slug, category),
         cost_tier:service_cost_tiers(id, tier_name, tier_name_ko, price_monthly, price_yearly)`
      )
      .eq('project_id', project_id)
      .order('created_at');

    interface ServiceRow {
      id: string;
      service_id: string;
      cost_tier_id: string | null;
      custom_cost_monthly: number | null;
      custom_cost_yearly: number | null;
      cost_notes: string | null;
      billing_cycle: string;
      actual_cost_monthly: number | null;
      service: { id: string; name: string; slug: string; category: string } | null;
      cost_tier: {
        id: string;
        tier_name: string;
        tier_name_ko: string | null;
        price_monthly: string | null;
        price_yearly: string | null;
      } | null;
    }

    const projectServices = (rawProjectServices ?? []) as unknown as ServiceRow[];

    // ── Tool executor ─────────────────────────────────────────────────────────
    const toolExecutor = async (name: string, args: Record<string, unknown>): Promise<string> => {
      switch (name) {
        case 'get_project_cost_breakdown': {
          const breakdown = projectServices.map((row) => {
            let monthlyCost = 0;
            if (row.actual_cost_monthly != null) {
              monthlyCost = row.actual_cost_monthly;
            } else if (row.custom_cost_monthly != null) {
              monthlyCost = row.custom_cost_monthly;
            } else if (row.cost_tier?.price_monthly) {
              const match = row.cost_tier.price_monthly.match(/^\$?([\d,]+\.?\d*)$/);
              if (match) monthlyCost = parseFloat(match[1].replace(/,/g, ''));
            }

            return {
              service_name: row.service?.name ?? 'Unknown',
              service_slug: row.service?.slug ?? '',
              category: row.service?.category ?? '',
              tier_name: row.cost_tier?.tier_name ?? null,
              tier_name_ko: row.cost_tier?.tier_name_ko ?? null,
              monthly_cost_usd: monthlyCost,
              billing_cycle: row.billing_cycle,
              is_custom_cost: row.custom_cost_monthly != null,
              is_actual_usage: row.actual_cost_monthly != null,
              cost_notes: row.cost_notes ?? null,
            };
          });

          const total = breakdown.reduce((sum, s) => sum + s.monthly_cost_usd, 0);

          return JSON.stringify({
            project_name: (project as { name: string }).name,
            monthly_budget_usd:
              (project as { budget_currency: string; monthly_budget: number | null })
                .budget_currency === 'USD'
                ? (project as { monthly_budget: number | null }).monthly_budget
                : null,
            total_monthly_cost_usd: total,
            service_count: breakdown.length,
            services: breakdown,
          });
        }

        case 'get_service_alternatives': {
          const { category } = args as { service_slug: string; category: string };

          const { data: alternativesRaw } = await supabase
            .from('services')
            .select('id, name, slug, category, description')
            .eq('category', category)
            .limit(5);

          const { data: tiersRaw } = await supabase
            .from('service_cost_tiers')
            .select('service_id, tier_name, tier_name_ko, price_monthly')
            .in(
              'service_id',
              (alternativesRaw ?? []).map((s) => s.id)
            )
            .order('price_monthly');

          const alternatives = (alternativesRaw ?? []).map((svc) => {
            const tiers = (tiersRaw ?? [])
              .filter((t) => t.service_id === svc.id)
              .slice(0, 3);
            return {
              name: svc.name,
              slug: svc.slug,
              category: svc.category,
              description: svc.description,
              pricing_tiers: tiers.map((t) => ({
                name: t.tier_name,
                name_ko: t.tier_name_ko,
                monthly_usd: t.price_monthly,
              })),
            };
          });

          return JSON.stringify({ category, alternatives });
        }

        case 'get_industry_benchmarks': {
          return JSON.stringify(INDUSTRY_BENCHMARKS);
        }

        default:
          return JSON.stringify({ error: `Unknown tool: ${name}` });
      }
    };

    // ── Phase 1: Function calling — data collection ───────────────────────────
    const orchestratorSystemPrompt = `당신은 SaaS 비용 최적화 전문 컨설턴트입니다.
제공된 도구로 프로젝트 비용 데이터와 시장 정보를 수집한 뒤,
수집한 데이터를 구조화된 형태로 요약합니다.

반드시 다음 도구를 모두 호출하세요:
1. get_project_cost_breakdown — 프로젝트 전체 비용 내역 조회
2. get_service_alternatives — 각 서비스의 대안 조회 (비용이 있는 서비스마다)
3. get_industry_benchmarks — 업계 벤치마크 데이터 조회

데이터 수집 후 최종 응답에 수집한 데이터를 요약 정리하세요.`;

    const { content: collectedData } = await callOpenAIWithTools(
      apiKey,
      [{ role: 'user', content: '프로젝트 비용 분석에 필요한 모든 데이터를 수집해주세요.' }],
      orchestratorSystemPrompt,
      tools,
      toolExecutor,
      { model: 'gpt-4o', temperature: 0.2, max_tokens: 4096, baseUrl },
      5,
    );

    // ── Phase 2: Structured output — report synthesis ─────────────────────────
    const reportSystemPrompt = `당신은 SaaS 비용 최적화 전문 컨설턴트입니다.
수집된 데이터를 바탕으로 구조화된 비용 분석 리포트를 JSON 형식으로 생성하세요.

요구사항:
- headline: 전체 비용 상태를 한 문장으로 요약 (예: "월 $123의 비용 중 30% 절감 가능")
- totalInsight: 전반적인 비용 현황과 주요 인사이트 2~3문장
- services: 각 서비스별 비용 비중, 상태(optimal/review/high_cost), 인사이트
- optimizations: 구체적인 절감 기회 (estimatedMonthlySaving은 USD 숫자)
- alternatives: 대안 서비스 제안 (실제 절감 가능 금액 포함)
- trends: 관련 시장 트렌드 3~5개
- actionItems: 우선순위별 실행 계획 (timeline별로 분류)

모든 내용은 한국어로 작성하고, 금액은 USD 기준 숫자로 표기하세요.`;

    const result = await callOpenAIStructured<CostReportResult>(
      apiKey,
      [{ role: 'user', content: `수집 데이터:\n\n${collectedData}` }],
      reportSystemPrompt,
      COST_REPORT_JSON_SCHEMA,
      { model: 'gpt-4o', temperature: 0.3, max_tokens: 4096, baseUrl },
    );

    // 5. Audit log (fire-and-forget)
    logAudit(user.id, {
      action: 'ai.cost_report',
      resourceType: 'project',
      resourceId: project_id,
      details: { service_count: projectServices.length },
    });

    return NextResponse.json(result.data);
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return new Response(
        JSON.stringify({ error: err.message, code: 'ai_key_not_configured' }),
        { status: 422 },
      );
    }
    return serverError(err instanceof Error ? err.message : '비용 리포트 생성 실패');
  }
}
