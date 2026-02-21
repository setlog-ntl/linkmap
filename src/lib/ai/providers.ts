import { buildHeaders } from './openai';

export type AiProviderSlug = 'openai' | 'anthropic' | 'google';

export interface AiChatRequest {
  provider: AiProviderSlug;
  model: string;
  messages: Array<{ role: string; content: string }>;
  systemPrompt: string;
  parameters: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number | null;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string[] | null;
    seed?: number | null;
  };
  apiKey: string;
  baseUrl?: string;
}

export interface AiChatResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callAiProvider(req: AiChatRequest): Promise<AiChatResponse> {
  switch (req.provider) {
    case 'openai':
      return callOpenAI(req);
    case 'anthropic':
      return callAnthropic(req);
    case 'google':
      return callGoogle(req);
    default:
      throw new Error(`지원하지 않는 제공자: ${req.provider}`);
  }
}

// ============================================
// OpenAI
// ============================================
async function callOpenAI(req: AiChatRequest): Promise<AiChatResponse> {
  const baseUrl = req.baseUrl || 'https://api.openai.com/v1';
  const body: Record<string, unknown> = {
    model: req.model,
    messages: [
      { role: 'system', content: req.systemPrompt },
      ...req.messages,
    ],
    temperature: req.parameters.temperature ?? 0.3,
    max_tokens: req.parameters.max_tokens ?? 4096,
  };

  if (req.parameters.top_p != null) body.top_p = req.parameters.top_p;
  if (req.parameters.frequency_penalty) body.frequency_penalty = req.parameters.frequency_penalty;
  if (req.parameters.presence_penalty) body.presence_penalty = req.parameters.presence_penalty;
  if (req.parameters.stop?.length) body.stop = req.parameters.stop;
  if (req.parameters.seed != null) body.seed = req.parameters.seed;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildHeaders(req.apiKey),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenAI API 오류 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    usage: {
      prompt_tokens: data.usage?.prompt_tokens || 0,
      completion_tokens: data.usage?.completion_tokens || 0,
      total_tokens: data.usage?.total_tokens || 0,
    },
  };
}

// ============================================
// Anthropic
// ============================================
async function callAnthropic(req: AiChatRequest): Promise<AiChatResponse> {
  const baseUrl = req.baseUrl || 'https://api.anthropic.com/v1';
  const body: Record<string, unknown> = {
    model: req.model,
    system: req.systemPrompt,
    messages: req.messages.map((m) => ({
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content,
    })),
    max_tokens: req.parameters.max_tokens ?? 4096,
    temperature: req.parameters.temperature ?? 0.3,
  };

  if (req.parameters.top_p != null) body.top_p = req.parameters.top_p;
  if (req.parameters.stop?.length) body.stop_sequences = req.parameters.stop;

  const response = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Anthropic API 오류 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '';
  return {
    content,
    usage: {
      prompt_tokens: data.usage?.input_tokens || 0,
      completion_tokens: data.usage?.output_tokens || 0,
      total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    },
  };
}

// ============================================
// Google (Gemini)
// ============================================
async function callGoogle(req: AiChatRequest): Promise<AiChatResponse> {
  const baseUrl = req.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';

  const contents = req.messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = {
    contents,
    systemInstruction: { parts: [{ text: req.systemPrompt }] },
    generationConfig: {
      temperature: req.parameters.temperature ?? 0.3,
      maxOutputTokens: req.parameters.max_tokens ?? 4096,
      ...(req.parameters.top_p != null ? { topP: req.parameters.top_p } : {}),
      ...(req.parameters.stop?.length ? { stopSequences: req.parameters.stop } : {}),
    },
  };

  const response = await fetch(
    `${baseUrl}/models/${req.model}:generateContent?key=${req.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Google AI API 오류 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const usageMeta = data.usageMetadata || {};
  return {
    content,
    usage: {
      prompt_tokens: usageMeta.promptTokenCount || 0,
      completion_tokens: usageMeta.candidatesTokenCount || 0,
      total_tokens: usageMeta.totalTokenCount || 0,
    },
  };
}
