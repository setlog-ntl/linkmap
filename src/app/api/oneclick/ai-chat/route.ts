import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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

// P0-2 fix: Zod 입력 검증 스키마 — 미검증 사용자 입력의 시스템 프롬프트 주입 방지
const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(50_000, '메시지가 너무 깁니다'),
      })
    )
    .min(1, '메시지가 필요합니다')
    .max(50, '대화 기록이 너무 깁니다'),
  fileContent: z.string().max(200_000, '파일이 너무 큽니다').optional(),
  filePath: z
    .string()
    .max(500, '파일 경로가 너무 깁니다')
    .refine((v) => !v.includes('..'), '유효하지 않은 경로')
    .optional(),
  allFiles: z.array(z.string().max(500)).max(200, '파일 목록이 너무 큽니다').optional(),
  persona_id: z.string().uuid('유효하지 않은 persona ID').optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  // P0-2 fix: safeParse로 모든 입력 검증
  const body = await request.json();
  const parsed = aiChatSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(', ');
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { messages, fileContent, filePath, allFiles, persona_id } = parsed.data;

  try {
    let configPrompt = DEFAULT_SYSTEM_PROMPT;
    let configModel = DEFAULT_MODEL;
    let configTemperature = DEFAULT_TEMPERATURE;
    let configMaxTokens = DEFAULT_MAX_TOKENS;
    let configProvider = 'openai';
    let configTopP: number | null = null;
    let configFreqPenalty = 0;
    let configPresPenalty = 0;
    let configStopSeq: string[] | null = null;

    // 1. Load global config (supabase 클라이언트 — ai_assistant_config에 authenticated read 정책 있음)
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

      if (dbConfig.custom_instructions) {
        configPrompt += `\n\nAdditional instructions:\n${dbConfig.custom_instructions}`;
      }
    }

    // 2. Load persona overrides (supabase 클라이언트 — ai_personas에 authenticated read 정책 있음)
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
    // P0-2 fix: adminSupabase → supabase (042 마이그레이션으로 authenticated read policy 추가)
    const { data: guardrails } = await supabase
      .from('ai_guardrails')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (guardrails) {
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const result = checkGuardrails(
        lastUserMessage,
        guardrails as AiGuardrails,
        messages.length
      );
      if (!result.allowed) {
        return NextResponse.json(
          { reply: `⚠️ ${result.reason}` },
          { status: 200 }
        );
      }
    }

    // 4. Resolve API key
    // P0-2 note: ai_providers에는 encrypted_api_key가 포함되어 있어 일반 RLS read 불가.
    // 서버 API 라우트에서만 호출되며 클라이언트에 키가 노출되지 않으므로 adminSupabase 유지.
    // (CLAUDE.md 예외: 암호화 키 조회 목적의 서버 전용 접근)
    let apiKey: string | undefined;
    let baseUrl: string | undefined;

    if (configProvider === 'openai' && process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
      baseUrl = process.env.OPENAI_BASE_URL;
    } else {
      const adminSupabase = createAdminClient();
      const { data: providerRow } = await adminSupabase
        .from('ai_providers')
        .select('encrypted_api_key, base_url')
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
    // P0-2 fix: Zod로 검증된 값만 사용 (filePath, allFiles, fileContent 모두 검증 완료)
    const allFilesContext =
      Array.isArray(allFiles) && allFiles.length > 0
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
    // P0-2 fix: supabase 클라이언트로 변경 (042 마이그레이션으로 user own insert policy 추가)
    supabase.from('ai_usage_logs').insert({
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
