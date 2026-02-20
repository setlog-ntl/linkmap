import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError, configurationError } from '@/lib/api/errors';
import { compareServicesSchema } from '@/lib/validations/ai-compare';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { logAudit } from '@/lib/audit';
import { services as serviceCatalog } from '@/data/seed/services';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  try {
    const body = await request.json();
    const parsed = compareServicesSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { slugs } = parsed.data;

    const { apiKey, baseUrl } = await resolveOpenAIKey();

    // Gather full service data for comparison
    const selectedServices = slugs
      .map((slug) => serviceCatalog.find((s) => s.slug === slug))
      .filter(Boolean)
      .map((s) => ({
        slug: s!.slug,
        name: s!.name,
        category: s!.category,
        description: s!.description,
        tags: s!.tags || [],
        pricing_info: s!.pricing_info,
        monthly_cost_estimate: s!.monthly_cost_estimate || {},
        dx_score: s!.dx_score || 0,
        difficulty_level: s!.difficulty_level || 'beginner',
        free_tier_quality: s!.free_tier_quality || 'unknown',
        vendor_lock_in_risk: s!.vendor_lock_in_risk || 'unknown',
        setup_time_minutes: s!.setup_time_minutes || 0,
        required_env_vars: (s!.required_env_vars || []).length,
        compatibility: s!.compatibility || {},
        alternatives: s!.alternatives || [],
      }));

    if (selectedServices.length < 2) {
      return serverError('비교할 서비스를 찾을 수 없습니다');
    }

    const systemPrompt = `당신은 DevOps 서비스 비교 전문가입니다. 서비스 카탈로그의 실제 데이터를 기반으로 객관적 비교 분석을 제공합니다.

비교 형식 (마크다운):

## 비교표

| 항목 | ${selectedServices.map((s) => s.name).join(' | ')} |
|------|${selectedServices.map(() => '------').join('|')}|
| 카테고리 | ... |
| 무료 등급 | ... |
| DX 점수 | ... |
| 셋업 시간 | ... |
| 벤더 락인 | ... |
| 가격 | ... |

## 추천

가장 추천하는 서비스와 이유 (한국어 2~3문장)

## 사용 사례별 추천

- 빠른 프로토타이핑: ...
- 프로덕션 확장: ...
- 비용 최적화: ...

규칙:
- 한국어로 응답
- 데이터 기반 객관적 비교
- 장단점 균형 있게 제시`;

    const base = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `다음 서비스들을 비교해주세요:\n${JSON.stringify(selectedServices, null, 2)}` },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API 오류: ${errText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';

    logAudit(user.id, {
      action: 'ai.compare_services',
      resourceType: 'ai',
      details: { slugs, tokens: result.usage?.total_tokens || 0 },
    });

    return Response.json({ comparison: content, services: selectedServices.map((s) => s.name) });
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return configurationError(err.message, 'ai_key_not_configured');
    }
    return serverError(err instanceof Error ? err.message : '서비스 비교 실패');
  }
}
