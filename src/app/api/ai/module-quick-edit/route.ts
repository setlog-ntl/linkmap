import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIStructured } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';
import { aiQuickEditSchema } from '@/lib/validations/ai-quick-edit';
import { getQuickEdits } from '@/data/oneclick/module-quick-edits';

interface QuickEditResponse {
  values: Record<string, unknown>;
  reasoning: string;
}

const JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    values: {
      type: 'object' as const,
      additionalProperties: true,
    },
    reasoning: { type: 'string' as const },
  },
  required: ['values', 'reasoning'] as const,
  additionalProperties: false as const,
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = aiQuickEditSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      parsed.error.issues.map((e) => e.message).join(', '),
      400
    );
  }

  const {
    questionId,
    templateSlug,
    targetModuleId,
    targetFields,
    currentValues,
    fieldHints,
  } = parsed.data;

  // 질문 ID 유효성 검증
  const quickEdits = getQuickEdits(templateSlug);
  const question = quickEdits.find((q) => q.id === questionId);
  if (!question) {
    return apiError('유효하지 않은 퀵 에딧 질문입니다.', 400);
  }

  try {
    const { apiKey, baseUrl } = await resolveOpenAIKey();

    const fieldHintText = fieldHints
      ? fieldHints
          .map((h) => {
            let desc = `- ${h.key}: type=${h.type}`;
            if (h.options) {
              desc += `, options=[${h.options.map((o) => o.value).join(', ')}]`;
            }
            return desc;
          })
          .join('\n')
      : '';

    const systemPrompt = `You are an AI assistant that performs quick edits on website template modules.

Template: "${templateSlug}"
Module: "${targetModuleId}"
Target fields: ${targetFields.join(', ')}

Task: ${question.systemHint}

Current values:
${JSON.stringify(currentValues, null, 2)}

${fieldHintText ? `Field type information:\n${fieldHintText}\n` : ''}
Return a JSON object with:
- values: object mapping field keys to new values. Only include the target fields: ${targetFields.join(', ')}
- reasoning: brief explanation of changes (1-2 sentences in Korean)

Important:
- Only modify the specified target fields
- Preserve the data structure (arrays stay arrays, objects stay objects)
- For color fields, return valid CSS hex color codes (e.g. #FF6B35)
- For array fields, return the complete updated array
- For text fields, keep similar length unless improvement requires expansion`;

    const { data, usage } = await callOpenAIStructured<QuickEditResponse>(
      apiKey,
      [
        {
          role: 'user',
          content: `Execute quick edit: "${question.label}"`,
        },
      ],
      systemPrompt,
      JSON_SCHEMA,
      { temperature: 0.7, max_tokens: 1024, baseUrl }
    );

    await logAudit(user.id, {
      action: 'ai.module_quick_edit',
      resourceType: 'homepage_deploy',
      resourceId: templateSlug,
      details: {
        questionId,
        targetModuleId,
        targetFields,
        tokens: usage.total_tokens,
      },
    });

    return NextResponse.json({
      values: data.values,
      reasoning: data.reasoning,
    });
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return apiError(err.message, 422);
    }
    return serverError(
      err instanceof Error ? err.message : 'AI 퀵 편집 중 오류 발생'
    );
  }
}
