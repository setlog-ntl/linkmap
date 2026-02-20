import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, configurationError } from '@/lib/api/errors';
import { stackRecommendSchema } from '@/lib/validations/ai-stack';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIStructured } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';
import { services as serviceCatalog } from '@/data/seed/services';

const STACK_JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    services: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          slug: { type: 'string' as const },
          name: { type: 'string' as const },
          layer: { type: 'string' as const },
          reason: { type: 'string' as const },
        },
        required: ['slug', 'name', 'layer', 'reason'],
        additionalProperties: false,
      },
    },
    connections: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          from: { type: 'string' as const },
          to: { type: 'string' as const },
          type: { type: 'string' as const },
        },
        required: ['from', 'to', 'type'],
        additionalProperties: false,
      },
    },
    monthly_cost: { type: 'string' as const },
    complexity_score: { type: 'number' as const },
    summary: { type: 'string' as const },
  },
  required: ['services', 'connections', 'monthly_cost', 'complexity_score', 'summary'],
  additionalProperties: false,
};

interface StackResult {
  services: Array<{ slug: string; name: string; layer: string; reason: string }>;
  connections: Array<{ from: string; to: string; type: string }>;
  monthly_cost: string;
  complexity_score: number;
  summary: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    const body = await request.json();
    const parsed = stackRecommendSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { description } = parsed.data;

    const { apiKey } = await resolveOpenAIKey();

    // Build service catalog context (compact)
    const catalogContext = serviceCatalog.map((s) => ({
      slug: s.slug,
      name: s.name,
      category: s.category,
      tags: s.tags || [],
      domain: s.domain || '',
      monthly_cost_estimate: s.monthly_cost_estimate || {},
      dx_score: s.dx_score || 0,
    }));

    const systemPrompt = `당신은 소프트웨어 아키텍트입니다. 사용자의 프로젝트 요구사항을 분석하여 최적의 서비스 스택을 추천합니다.

사용 가능한 서비스 카탈로그:
${JSON.stringify(catalogContext)}

규칙:
1. 카탈로그에 있는 서비스만 추천하세요 (slug가 정확히 일치해야 함)
2. layer는 "frontend", "backend", "database", "auth", "payment", "ai", "monitoring", "storage", "email", "deploy" 중 하나
3. 연결(connections)의 type은 "uses", "integrates", "data_transfer", "api_call", "auth_provider" 중 하나
4. monthly_cost는 한국어로 "약 $XX~$YY/월" 형식
5. complexity_score는 1(간단)~10(복잡) 사이
6. summary는 한국어 2~3문장
7. 프로젝트에 적합한 5~12개 서비스를 추천하세요`;

    const { data, usage } = await callOpenAIStructured<StackResult>(
      apiKey,
      [{ role: 'user', content: description }],
      systemPrompt,
      STACK_JSON_SCHEMA,
      { model: 'gpt-4o', temperature: 0.4, max_tokens: 4096 },
    );

    logAudit(user.id, {
      action: 'ai.stack_recommend',
      resourceType: 'ai',
      details: {
        description: description.slice(0, 100),
        service_count: data.services.length,
        tokens: usage.total_tokens,
      },
    });

    return Response.json(data);
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return configurationError(err.message, 'ai_key_not_configured');
    }
    return serverError(err instanceof Error ? err.message : '스택 추천 실패');
  }
}
