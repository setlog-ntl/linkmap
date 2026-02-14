import type { AiGuardrails } from '@/types';

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
}

export function checkGuardrails(
  input: string,
  guardrails: AiGuardrails | null,
  conversationTurns: number
): GuardrailResult {
  if (!guardrails || !guardrails.is_active) {
    return { allowed: true };
  }

  // 1. Conversation turn limit
  if (conversationTurns > guardrails.max_conversation_turns) {
    return {
      allowed: false,
      reason: `대화 턴 제한(${guardrails.max_conversation_turns}회)을 초과했습니다.`,
    };
  }

  // 2. Input token estimate (rough: 1 token ≈ 4 chars for Korean, 1 token ≈ 4 chars avg)
  const estimatedTokens = Math.ceil(input.length / 3);
  if (estimatedTokens > guardrails.max_input_tokens) {
    return {
      allowed: false,
      reason: `입력이 너무 깁니다. 최대 ${guardrails.max_input_tokens} 토큰까지 허용됩니다.`,
    };
  }

  // 3. Blocked words check (case-insensitive substring)
  const lowerInput = input.toLowerCase();
  for (const word of guardrails.blocked_words) {
    if (word && lowerInput.includes(word.toLowerCase())) {
      return {
        allowed: false,
        reason: `차단된 단어가 포함되어 있습니다.`,
      };
    }
  }

  // 4. Denied topics check (keyword matching)
  for (const topic of guardrails.denied_topics) {
    if (topic && lowerInput.includes(topic.toLowerCase())) {
      return {
        allowed: false,
        reason: `거부된 토픽이 포함되어 있습니다: ${topic}`,
      };
    }
  }

  return { allowed: true };
}
