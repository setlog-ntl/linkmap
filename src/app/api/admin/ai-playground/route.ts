import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin';
import { unauthorizedError, apiError, serverError, validationError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { playgroundSchema } from '@/lib/validations/ai-config';
import { callAiProvider } from '@/lib/ai/providers';
import { decrypt } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const admin = await isAdmin(user.id);
  if (!admin) return apiError('관리자 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = playgroundSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const input = parsed.data;
  const adminSupabase = createAdminClient();

  // Determine provider and model
  let providerSlug = input.provider || 'openai';
  let model = input.model || 'gpt-4o-mini';
  let systemPrompt = input.system_prompt || 'You are a helpful assistant.';

  // If persona_id is set, load persona for defaults
  if (input.persona_id) {
    const { data: persona } = await adminSupabase
      .from('ai_personas')
      .select('*')
      .eq('id', input.persona_id)
      .single();

    if (persona) {
      systemPrompt = persona.system_prompt;
      if (persona.provider) providerSlug = persona.provider;
      if (persona.model) model = persona.model;
    }
  }

  // Get API key from provider or env
  let apiKey: string | undefined;
  let baseUrl: string | undefined;

  if (providerSlug === 'openai' && process.env.OPENAI_API_KEY) {
    apiKey = process.env.OPENAI_API_KEY;
  } else {
    const { data: provider } = await adminSupabase
      .from('ai_providers')
      .select('*')
      .eq('slug', providerSlug)
      .single();

    if (provider?.encrypted_api_key) {
      apiKey = decrypt(provider.encrypted_api_key);
      baseUrl = provider.base_url || undefined;
    }
  }

  if (!apiKey) {
    return apiError(`${providerSlug} API 키가 설정되지 않았습니다`, 400);
  }

  const startTime = Date.now();

  try {
    const result = await callAiProvider({
      provider: providerSlug as 'openai' | 'anthropic' | 'google',
      model,
      messages: input.messages,
      systemPrompt,
      parameters: {
        temperature: input.temperature,
        max_tokens: input.max_tokens,
        top_p: input.top_p,
      },
      apiKey,
      baseUrl,
    });

    const responseTimeMs = Date.now() - startTime;

    // Log usage
    await adminSupabase.from('ai_usage_logs').insert({
      user_id: user.id,
      persona_id: input.persona_id || null,
      provider: providerSlug,
      model,
      prompt_tokens: result.usage.prompt_tokens,
      completion_tokens: result.usage.completion_tokens,
      total_tokens: result.usage.total_tokens,
      response_time_ms: responseTimeMs,
      status: 'success',
    });

    await logAudit(user.id, {
      action: 'admin.ai_playground_test',
      resourceType: 'ai_playground',
      details: { provider: providerSlug, model, tokens: result.usage.total_tokens },
    });

    return NextResponse.json({
      reply: result.content,
      usage: result.usage,
      response_time_ms: responseTimeMs,
    });
  } catch (err) {
    const responseTimeMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';

    // Log failed attempt
    await adminSupabase.from('ai_usage_logs').insert({
      user_id: user.id,
      persona_id: input.persona_id || null,
      provider: providerSlug,
      model,
      status: 'error',
      error_message: errorMessage,
      response_time_ms: responseTimeMs,
    });

    return serverError(errorMessage);
  }
}
