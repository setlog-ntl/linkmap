import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { callAiProvider } from '@/lib/ai/providers';
import { checkGuardrails } from '@/lib/ai/guardrails';
import { decrypt } from '@/lib/crypto';
import type { AiGuardrails } from '@/types';

const DEFAULT_SYSTEM_PROMPT = `You are a helpful code assistant integrated into a web-based code editor.
The user is editing a website. Your job is to help them modify or create files.

Rules:
- Always respond in the same language as the user's message (Korean if Korean, English if English).
- Keep explanations brief and focused.
- When providing code, always provide the FULL file content, not just the changed parts.
- For SINGLE file modifications, use this format:

📄 filename.html
\`\`\`html
...full content...
\`\`\`

- For MULTIPLE file changes, use the same format for each file.
- ALWAYS prefix each code block with 📄 followed by the file path.
- If the user asks a question (not a modification), answer concisely without code blocks.`;

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKENS = 4096;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  try {
    const { messages, fileContent, filePath, allFiles, persona_id } = await request.json();
    const adminSupabase = createAdminClient();

    // 1. Load global config
    let configPrompt = DEFAULT_SYSTEM_PROMPT;
    let configModel = DEFAULT_MODEL;
    let configTemperature = DEFAULT_TEMPERATURE;
    let configMaxTokens = DEFAULT_MAX_TOKENS;
    let configProvider = 'openai';
    let configTopP: number | null = null;
    let configFreqPenalty = 0;
    let configPresPenalty = 0;
    let configStopSeq: string[] | null = null;

    const { data: dbConfig } = await supabase
      .from('ai_assistant_config')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (dbConfig) {
      configPrompt = dbConfig.system_prompt;
      configModel = dbConfig.model;
      configTemperature = Number(dbConfig.temperature);
      configMaxTokens = dbConfig.max_tokens;
      configProvider = dbConfig.default_provider || 'openai';
      configTopP = dbConfig.top_p != null ? Number(dbConfig.top_p) : null;
      configFreqPenalty = Number(dbConfig.frequency_penalty) || 0;
      configPresPenalty = Number(dbConfig.presence_penalty) || 0;
      configStopSeq = dbConfig.stop_sequences;

      // Add custom instructions
      if (dbConfig.custom_instructions) {
        configPrompt += `\n\nAdditional instructions:\n${dbConfig.custom_instructions}`;
      }
    }

    // 2. Load persona overrides (if specified)
    let personaId: string | null = null;
    if (persona_id) {
      const { data: persona } = await supabase
        .from('ai_personas')
        .select('*')
        .eq('id', persona_id)
        .eq('is_active', true)
        .single();

      if (persona) {
        personaId = persona.id;
        configPrompt = persona.system_prompt;
        if (persona.provider) configProvider = persona.provider;
        if (persona.model) configModel = persona.model;
        if (persona.temperature != null) configTemperature = Number(persona.temperature);
        if (persona.max_tokens != null) configMaxTokens = persona.max_tokens;
        if (persona.top_p != null) configTopP = Number(persona.top_p);
        if (persona.frequency_penalty != null) configFreqPenalty = Number(persona.frequency_penalty);
        if (persona.presence_penalty != null) configPresPenalty = Number(persona.presence_penalty);
        if (persona.stop_sequences) configStopSeq = persona.stop_sequences;
      }
    } else if (dbConfig?.default_persona_id) {
      // Load default persona
      const { data: defaultPersona } = await supabase
        .from('ai_personas')
        .select('*')
        .eq('id', dbConfig.default_persona_id)
        .eq('is_active', true)
        .single();

      if (defaultPersona) {
        personaId = defaultPersona.id;
        configPrompt = defaultPersona.system_prompt;
        if (defaultPersona.provider) configProvider = defaultPersona.provider;
        if (defaultPersona.model) configModel = defaultPersona.model;
        if (defaultPersona.temperature != null) configTemperature = Number(defaultPersona.temperature);
        if (defaultPersona.max_tokens != null) configMaxTokens = defaultPersona.max_tokens;
      }
    }

    // 3. Guardrails check
    const { data: guardrails } = await adminSupabase
      .from('ai_guardrails')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (guardrails) {
      const lastUserMessage = messages?.[messages.length - 1]?.content || '';
      const result = checkGuardrails(
        lastUserMessage,
        guardrails as AiGuardrails,
        messages?.length || 0
      );
      if (!result.allowed) {
        return NextResponse.json(
          { reply: `⚠️ ${result.reason}` },
          { status: 200 }
        );
      }
    }

    // 4. Resolve API key
    let apiKey: string | undefined;
    let baseUrl: string | undefined;

    if (configProvider === 'openai' && process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
    } else {
      const { data: providerRow } = await adminSupabase
        .from('ai_providers')
        .select('*')
        .eq('slug', configProvider)
        .eq('is_enabled', true)
        .single();

      if (providerRow?.encrypted_api_key) {
        apiKey = decrypt(providerRow.encrypted_api_key);
        baseUrl = providerRow.base_url || undefined;
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: `${configProvider} API 키가 설정되지 않았습니다` },
        { status: 500 }
      );
    }

    // 5. Build system prompt with file context
    const allFilesContext = Array.isArray(allFiles) && allFiles.length > 0
      ? `\nAll files in this project: ${allFiles.join(', ')}`
      : '';

    const fullSystemPrompt = `${configPrompt}

Current file: ${filePath || 'unknown'}${allFilesContext}
Current file content:
\`\`\`
${fileContent || ''}
\`\`\``;

    // 6. Call AI provider
    const startTime = Date.now();

    const result = await callAiProvider({
      provider: configProvider as 'openai' | 'anthropic' | 'google',
      model: configModel,
      messages,
      systemPrompt: fullSystemPrompt,
      parameters: {
        temperature: configTemperature,
        max_tokens: configMaxTokens,
        top_p: configTopP,
        frequency_penalty: configFreqPenalty,
        presence_penalty: configPresPenalty,
        stop: configStopSeq,
      },
      apiKey,
      baseUrl,
    });

    const responseTimeMs = Date.now() - startTime;

    // 7. Log usage (fire-and-forget)
    adminSupabase.from('ai_usage_logs').insert({
      user_id: user.id,
      persona_id: personaId,
      provider: configProvider,
      model: configModel,
      prompt_tokens: result.usage.prompt_tokens,
      completion_tokens: result.usage.completion_tokens,
      total_tokens: result.usage.total_tokens,
      response_time_ms: responseTimeMs,
      status: 'success',
    }).then(() => {});

    return NextResponse.json({ reply: result.content });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '요청 처리 실패' },
      { status: 500 }
    );
  }
}
