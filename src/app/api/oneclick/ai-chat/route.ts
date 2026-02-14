import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const { messages, fileContent, filePath } = await request.json();

    const systemPrompt = `You are a helpful code assistant integrated into a web-based code editor.
The user is editing a website file. Your job is to help them modify their code.

Current file: ${filePath || 'unknown'}
Current file content:
\`\`\`
${fileContent || ''}
\`\`\`

Rules:
- When the user asks you to modify code, respond with the COMPLETE modified file content wrapped in a code block using triple backticks.
- If the user asks a question (not a modification), answer concisely.
- Always respond in the same language as the user's message (Korean if Korean, English if English).
- Keep explanations brief and focused.
- When providing code, always provide the FULL file content, not just the changed parts.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
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
