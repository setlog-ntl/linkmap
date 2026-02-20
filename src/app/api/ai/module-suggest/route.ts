import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIStructured } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const requestSchema = z.object({
  prompt: z.string().min(1).max(500),
  templateSlug: z.string().min(1),
  currentEnabled: z.array(z.string()),
  moduleNames: z.array(z.string()),
});

interface SuggestedState {
  enabled: string[];
  order: string[];
  values: Record<string, Record<string, unknown>>;
}

const JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    enabled: { type: 'array' as const, items: { type: 'string' as const } },
    order: { type: 'array' as const, items: { type: 'string' as const } },
    values: {
      type: 'object' as const,
      additionalProperties: {
        type: 'object' as const,
        additionalProperties: true,
      },
    },
    reasoning: { type: 'string' as const },
  },
  required: ['enabled', 'order', 'values', 'reasoning'] as const,
  additionalProperties: false as const,
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues.map((e) => e.message).join(', '), 400);
  }

  const { prompt, templateSlug, currentEnabled, moduleNames } = parsed.data;

  try {
    const { apiKey, baseUrl } = await resolveOpenAIKey();

    const systemPrompt = `You are an AI assistant that configures website template modules.
The user has a "${templateSlug}" template with these available modules: ${moduleNames.join(', ')}.
Currently enabled: ${currentEnabled.join(', ')}.

Based on the user's request, return a JSON object with:
- enabled: array of module IDs to enable
- order: array of module IDs in display order (same as enabled)
- values: object mapping module ID to field values to change (only include fields that should change)
- reasoning: brief explanation of your choices (1-2 sentences in the user's language)

Only use valid module IDs from the available modules list.
For the "values" field, only include module IDs and field keys that exist in the schema.
Keep existing values unless the user specifically asks to change them.`;

    const { data, usage } = await callOpenAIStructured<SuggestedState & { reasoning: string }>(
      apiKey,
      [{ role: 'user', content: prompt }],
      systemPrompt,
      JSON_SCHEMA,
      { temperature: 0.5, baseUrl },
    );

    await logAudit(user.id, {
      action: 'ai.module_suggest',
      resourceType: 'homepage_deploy',
      resourceId: templateSlug,
      details: {
        prompt,
        tokens: usage.total_tokens,
      },
    });

    return NextResponse.json({
      state: {
        enabled: data.enabled,
        order: data.order,
        values: data.values,
      },
      reasoning: data.reasoning,
    });
  } catch (err) {
    if (err instanceof AIKeyNotConfiguredError) {
      return apiError(err.message, 422);
    }
    return serverError(err instanceof Error ? err.message : 'AI 추천 중 오류 발생');
  }
}
