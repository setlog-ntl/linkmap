import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveOpenAIKey, AIKeyNotConfiguredError } from '@/lib/ai/resolve-key';
import { callOpenAIStream } from '@/lib/ai/openai';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: '인증이 필요합니다' }), { status: 401 });
  }

  try {
    const { project_id, nodes, edges, health } = await request.json();
    if (!project_id || !nodes) {
      return new Response(JSON.stringify({ error: '프로젝트 ID와 노드 정보가 필요합니다' }), { status: 400 });
    }

    const { apiKey } = await resolveOpenAIKey();

    const systemPrompt = `당신은 소프트웨어 아키텍처 분석 전문가입니다. 서비스맵 데이터를 분석하여 인사이트를 제공합니다.

분석 형식 (마크다운):
## 📊 아키텍처 요약
현재 아키텍처 구성 요약 (2~3문장)

## ⚠️ 위험 분석
- SPOF(Single Point of Failure) 식별
- 누락된 레이어 (캐시, 모니터링 등)
- 보안 취약점

## 💡 최적화 제안
- 성능 개선 방안
- 비용 최적화
- 확장성 제안

## 🏗️ 레이어 구조
현재 레이어별 서비스 분류

규칙:
- 한국어로 응답
- 구체적이고 실행 가능한 제안
- 실제 서비스 이름 사용
- 짧고 임팩트 있게`;

    const userMessage = `서비스맵 데이터:
노드: ${JSON.stringify(nodes)}
연결: ${JSON.stringify(edges || [])}
헬스 상태: ${JSON.stringify(health || [])}

이 아키텍처를 분석해주세요.`;

    const stream = callOpenAIStream(
      apiKey,
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      { model: 'gpt-4o', temperature: 0.4, max_tokens: 2048 },
    );

    logAudit(user.id, {
      action: 'ai.map_narrate',
      resourceType: 'project',
      resourceId: project_id,
      details: { node_count: nodes.length, edge_count: edges?.length || 0 },
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
      return new Response(
        JSON.stringify({ error: err.message, code: 'ai_key_not_configured' }),
        { status: 422 },
      );
    }
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : '분석 실패' }),
      { status: 500 },
    );
  }
}
