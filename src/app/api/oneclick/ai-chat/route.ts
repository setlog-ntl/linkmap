import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

- For MULTIPLE file changes (e.g. new page + style update), use the same format for each file:

📄 index.html
\`\`\`html
...full content...
\`\`\`

📄 about.html
\`\`\`html
...full content...
\`\`\`

- ALWAYS prefix each code block with 📄 followed by the file path.
- When creating new files, use simple filenames (e.g. about.html, contact.html, style.css).
- If the user asks a question (not a modification), answer concisely without code blocks.`;

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKENS = 4096;

export async function POST(request: NextRequest) {
  // 인증 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API 키가 설정되지 않았습니다' }, { status: 500 });
  }

  try {
    const { messages, fileContent, filePath, allFiles } = await request.json();

    // DB에서 활성 AI 설정 조회 (RLS: anyone_can_read_active 정책)
    let configPrompt = DEFAULT_SYSTEM_PROMPT;
    let configModel = DEFAULT_MODEL;
    let configTemperature = DEFAULT_TEMPERATURE;
    let configMaxTokens = DEFAULT_MAX_TOKENS;

    const { data: dbConfig } = await supabase
      .from('ai_assistant_config')
      .select('system_prompt, model, temperature, max_tokens')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (dbConfig) {
      configPrompt = dbConfig.system_prompt;
      configModel = dbConfig.model;
      configTemperature = Number(dbConfig.temperature);
      configMaxTokens = dbConfig.max_tokens;
    }

    const allFilesContext = Array.isArray(allFiles) && allFiles.length > 0
      ? `\nAll files in this project: ${allFiles.join(', ')}`
      : '';

    const systemPrompt = `${configPrompt}

Current file: ${filePath || 'unknown'}${allFilesContext}
Current file content:
\`\`\`
${fileContent || ''}
\`\`\``;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: configModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: configMaxTokens,
        temperature: configTemperature,
      }),
    });

    if (!response.ok) {
      await response.text();
      return NextResponse.json(
        { error: `OpenAI API 오류: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '요청 처리 실패' },
      { status: 500 }
    );
  }
}
