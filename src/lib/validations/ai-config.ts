import { z } from 'zod';

// ============================================
// Persona
// ============================================
export const createPersonaSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').max(100),
  name_ko: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  description_ko: z.string().max(500).nullable().optional(),
  system_prompt: z.string().min(1, '시스템 프롬프트는 필수입니다').max(10000),
  avatar_icon: z.string().max(50).optional().default('bot'),
  avatar_color: z.string().max(20).optional().default('#8B5CF6'),
  is_default: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().int().optional().default(0),
  provider: z.enum(['openai', 'anthropic', 'google']).nullable().optional(),
  model: z.string().max(100).nullable().optional(),
  temperature: z.number().min(0).max(2).nullable().optional(),
  max_tokens: z.number().int().min(1).max(128000).nullable().optional(),
  top_p: z.number().min(0).max(1).nullable().optional(),
  frequency_penalty: z.number().min(-2).max(2).nullable().optional(),
  presence_penalty: z.number().min(-2).max(2).nullable().optional(),
  stop_sequences: z.array(z.string()).nullable().optional(),
  response_format: z.enum(['text', 'json_object']).optional().default('text'),
});

export const updatePersonaSchema = createPersonaSchema.partial();

export type CreatePersonaInput = z.input<typeof createPersonaSchema>;
export type UpdatePersonaInput = z.input<typeof updatePersonaSchema>;

// ============================================
// Provider
// ============================================
export const updateProviderSchema = z.object({
  is_enabled: z.boolean().optional(),
  api_key: z.string().max(500).optional(),
  base_url: z.string().url().max(500).nullable().optional(),
});

export type UpdateProviderInput = z.input<typeof updateProviderSchema>;

// ============================================
// Guardrails
// ============================================
const filterLevel = z.enum(['off', 'low', 'medium', 'high']);

export const updateGuardrailsSchema = z.object({
  content_filter_hate: filterLevel.optional(),
  content_filter_violence: filterLevel.optional(),
  content_filter_sexual: filterLevel.optional(),
  content_filter_self_harm: filterLevel.optional(),
  denied_topics: z.array(z.string().max(100)).optional(),
  blocked_words: z.array(z.string().max(100)).optional(),
  max_conversation_turns: z.number().int().min(1).max(200).optional(),
  max_input_tokens: z.number().int().min(100).max(128000).optional(),
  pii_detection_enabled: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type UpdateGuardrailsInput = z.input<typeof updateGuardrailsSchema>;

// ============================================
// Prompt Template
// ============================================
export const createTemplateSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').max(100),
  name_ko: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  description_ko: z.string().max(500).nullable().optional(),
  category: z.enum(['code', 'design', 'content', 'debug', 'general']).default('general'),
  prompt_text: z.string().min(1, '프롬프트는 필수입니다').max(5000),
  prompt_text_ko: z.string().max(5000).nullable().optional(),
  icon: z.string().max(50).optional().default('sparkles'),
  sort_order: z.number().int().optional().default(0),
  is_active: z.boolean().optional().default(true),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateInput = z.input<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.input<typeof updateTemplateSchema>;

// ============================================
// Global AI Config (extended)
// ============================================
export const updateGlobalConfigSchema = z.object({
  system_prompt: z.string().min(1).max(10000).optional(),
  model: z.string().max(100).optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(128000).optional(),
  is_active: z.boolean().optional(),
  top_p: z.number().min(0).max(1).nullable().optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  stop_sequences: z.array(z.string()).nullable().optional(),
  seed: z.number().int().nullable().optional(),
  response_format: z.enum(['text', 'json_object']).optional(),
  default_persona_id: z.string().uuid().nullable().optional(),
  default_provider: z.enum(['openai', 'anthropic', 'google']).optional(),
  response_language: z.enum(['auto', 'ko', 'en']).optional(),
  streaming_enabled: z.boolean().optional(),
  custom_instructions: z.string().max(5000).nullable().optional(),
});

export type UpdateGlobalConfigInput = z.input<typeof updateGlobalConfigSchema>;

// ============================================
// Playground
// ============================================
export const playgroundSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(10000),
  })).min(1),
  persona_id: z.string().uuid().nullable().optional(),
  provider: z.enum(['openai', 'anthropic', 'google']).optional(),
  model: z.string().max(100).optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(128000).optional(),
  top_p: z.number().min(0).max(1).nullable().optional(),
  system_prompt: z.string().max(10000).optional(),
});

export type PlaygroundInput = z.input<typeof playgroundSchema>;
