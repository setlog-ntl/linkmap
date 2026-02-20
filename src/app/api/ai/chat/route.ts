import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, validationError, serverError, configurationError } from '@/lib/api/errors';
import { aiChatSchema } from '@/lib/validations/ai-chat';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIStream } from '@/lib/ai/openai';
import { checkGuardrails } from '@/lib/ai/guardrails';
import { logAudit } from '@/lib/audit';
import { services as serviceCatalog } from '@/data/seed/services';

function buildCatalogContext(): string {
  const grouped: Record<string, string[]> = {};
  for (const svc of serviceCatalog) {
    const layer = svc.domain || svc.category || 'other';
    if (!grouped[layer]) grouped[layer] = [];
    grouped[layer].push(`${svc.name} (${svc.slug})`);
  }
  return Object.entries(grouped)
    .map(([layer, svcs]) => `[${layer}] ${svcs.join(', ')}`)
    .join('\n');
}

function buildSystemPrompt(
  projectName: string,
  contextInfo: { services?: string[]; env_count?: number; connections_count?: number } | undefined,
  overridePrompt: string | null,
  personaPrompt: string | null,
  answerGuide: string | null,
): string {
  const base = personaPrompt || `당신은 Linkmap 프로젝트의 AI 스택 아키텍트입니다.
사용자의 프로젝트에 적합한 서비스와 아키텍처를 추천하고, 기술적인 질문에 답변합니다.
친절하고 전문적으로 답변하되, 한국어를 기본으로 사용합니다.`;

  const catalog = buildCatalogContext();

  let context = `\n\n## 프로젝트 정보
- 프로젝트명: ${projectName}`;

  if (contextInfo?.services?.length) {
    context += `\n- 현재 서비스: ${contextInfo.services.join(', ')}`;
  }
  if (contextInfo?.env_count !== undefined) {
    context += `\n- 환경변수 수: ${contextInfo.env_count}`;
  }
  if (contextInfo?.connections_count !== undefined) {
    context += `\n- 연결 수: ${contextInfo.connections_count}`;
  }

  const recommendFormat = `\n\n## 서비스 추천 형식
서비스를 추천할 때는 반드시 다음 형식의 코드블록을 응답에 포함하세요:

\`\`\`json:recommendations
[{"slug":"service-slug","name":"서비스명","layer":"레이어","reason":"추천 이유"}]
\`\`\`

사용 가능한 서비스 카탈로그:
${catalog}`;

  const override = overridePrompt ? `\n\n## 추가 지시사항\n${overridePrompt}` : '';

  const guide = answerGuide ? `\n\n## 답변 가이드\n이번 질문에 대해 다음 가이드라인을 따르세요:\n${answerGuide}` : '';

  return base + context + recommendFormat + override + guide;
}

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod safeParse
  const body = await request.json().catch(() => null);
  if (!body) return validationError({ issues: [{ message: '잘못된 요청입니다' }] } as never);

  const parsed = aiChatSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { messages, project_id, feature_slug, context: ctx } = parsed.data;

  // 3. Ownership check
  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', project_id)
    .single();

  if (!project) return serverError('프로젝트를 찾을 수 없습니다');

  // 4. Business logic
  try {
    const adminSupabase = createAdminClient();

    // Load feature config
    const { data: featureConfig } = await adminSupabase
      .from('ai_feature_personas')
      .select('*')
      .eq('feature_slug', feature_slug)
      .eq('is_active', true)
      .single();

    // Load persona if assigned
    let personaPrompt: string | null = null;
    let personaModel: string | null = null;
    let personaTemp: number | null = null;
    let personaMaxTokens: number | null = null;

    if (featureConfig?.persona_id) {
      const { data: persona } = await adminSupabase
        .from('ai_personas')
        .select('system_prompt, model, temperature, max_tokens')
        .eq('id', featureConfig.persona_id)
        .single();

      if (persona) {
        personaPrompt = persona.system_prompt;
        personaModel = persona.model;
        personaTemp = persona.temperature;
        personaMaxTokens = persona.max_tokens;
      }
    }

    // Load guardrails
    const { data: guardrails } = await adminSupabase
      .from('ai_guardrails')
      .select('*')
      .eq('is_active', true)
      .single();

    // Check guardrails on latest user message
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop();
    if (lastUserMsg) {
      const guardResult = checkGuardrails(lastUserMsg.content, guardrails, messages.length);
      if (!guardResult.allowed) {
        return serverError(guardResult.reason || '가드레일에 의해 차단되었습니다');
      }
    }

    // Check if last user message matches a Q&A question → inject answer_guide
    let answerGuide: string | null = null;
    if (lastUserMsg) {
      const { data: qnaList } = await adminSupabase
        .from('ai_feature_qna')
        .select('question, question_ko, answer_guide')
        .eq('feature_slug', feature_slug)
        .eq('is_active', true);

      if (qnaList?.length) {
        const userMsg = lastUserMsg.content.trim().toLowerCase();
        const matched = qnaList.find(
          (q) =>
            q.question.toLowerCase() === userMsg ||
            (q.question_ko && q.question_ko.toLowerCase() === userMsg),
        );
        if (matched) {
          answerGuide = matched.answer_guide;
        }
      }
    }

    // Resolve API key
    const { apiKey, baseUrl } = await resolveOpenAIKey();

    const systemPrompt = buildSystemPrompt(
      project.name,
      ctx,
      featureConfig?.system_prompt_override || null,
      personaPrompt,
      answerGuide,
    );

    const openaiMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const stream = callOpenAIStream(apiKey, openaiMessages, systemPrompt, {
      model: personaModel || undefined,
      temperature: personaTemp ?? undefined,
      max_tokens: personaMaxTokens ?? undefined,
      baseUrl,
    });

    // 5. Audit log (non-blocking)
    logAudit(user.id, {
      action: 'ai.chat',
      resourceType: 'project',
      resourceId: project_id,
      details: { feature_slug, message_count: messages.length },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return configurationError(err.message, 'AI_KEY_NOT_CONFIGURED');
    }
    console.error('AI Chat error:', err);
    return serverError('AI 채팅 오류가 발생했습니다');
  }
}
