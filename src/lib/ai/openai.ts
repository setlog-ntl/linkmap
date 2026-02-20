/**
 * OpenAI API helpers — 3 calling modes:
 * 1. Structured Output (JSON Schema)
 * 2. Function Calling (tools)
 * 3. Streaming (SSE)
 */

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIParams {
  temperature?: number;
  max_tokens?: number;
  model?: string;
  baseUrl?: string;
}

// ─── 1. Structured Output ───────────────────────────────────────────

export async function callOpenAIStructured<T>(
  apiKey: string,
  messages: OpenAIMessage[],
  systemPrompt: string,
  jsonSchema: Record<string, unknown>,
  params: OpenAIParams = {},
): Promise<{ data: T; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const model = params.model || 'gpt-4o';
  const base = (params.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: params.temperature ?? 0.3,
      max_tokens: params.max_tokens ?? 4096,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'response',
          strict: true,
          schema: jsonSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenAI API 오류 (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || '{}';
  return {
    data: JSON.parse(content) as T,
    usage: {
      prompt_tokens: result.usage?.prompt_tokens || 0,
      completion_tokens: result.usage?.completion_tokens || 0,
      total_tokens: result.usage?.total_tokens || 0,
    },
  };
}

// ─── 2. Function Calling (tools) ────────────────────────────────────

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface ToolCallResult {
  id: string;
  function: { name: string; arguments: string };
}

export async function callOpenAIWithTools(
  apiKey: string,
  messages: OpenAIMessage[],
  systemPrompt: string,
  tools: ToolDefinition[],
  toolExecutor: (name: string, args: Record<string, unknown>) => Promise<string>,
  params: OpenAIParams = {},
  maxIterations = 5,
): Promise<{ content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const model = params.model || 'gpt-4o';
  const base = (params.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  const conversationMessages: Array<Record<string, unknown>> = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  for (let i = 0; i < maxIterations; i++) {
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: conversationMessages,
        temperature: params.temperature ?? 0.3,
        max_tokens: params.max_tokens ?? 4096,
        tools,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API 오류 (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const usage = result.usage || {};
    totalUsage.prompt_tokens += usage.prompt_tokens || 0;
    totalUsage.completion_tokens += usage.completion_tokens || 0;
    totalUsage.total_tokens += usage.total_tokens || 0;

    const choice = result.choices?.[0];
    if (!choice) throw new Error('OpenAI 응답이 비어있습니다');

    const assistantMessage = choice.message;
    conversationMessages.push(assistantMessage);

    if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls?.length) {
      for (const toolCall of assistantMessage.tool_calls as ToolCallResult[]) {
        const args = JSON.parse(toolCall.function.arguments);
        const toolResult = await toolExecutor(toolCall.function.name, args);
        conversationMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }
      continue;
    }

    // No more tool calls — return final content
    return { content: assistantMessage.content || '', usage: totalUsage };
  }

  // Max iterations reached — return last content
  const lastMsg = conversationMessages[conversationMessages.length - 1];
  return {
    content: (lastMsg as { content?: string }).content || '분석을 완료하지 못했습니다.',
    usage: totalUsage,
  };
}

// ─── 3. Streaming ───────────────────────────────────────────────────

export function callOpenAIStream(
  apiKey: string,
  messages: OpenAIMessage[],
  systemPrompt: string,
  params: OpenAIParams = {},
): ReadableStream {
  const model = params.model || 'gpt-4o';
  const base = (params.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            temperature: params.temperature ?? 0.3,
            max_tokens: params.max_tokens ?? 4096,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `OpenAI 오류: ${errText}` })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);

            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.choices?.[0]?.delta?.content;
              if (chunk) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              }
            } catch {
              // skip malformed lines
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });
}
