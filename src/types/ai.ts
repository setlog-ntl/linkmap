export type AiProviderSlug = 'openai' | 'anthropic' | 'google';
export type ContentFilterLevel = 'off' | 'low' | 'medium' | 'high';
export type TemplateCategory = 'code' | 'design' | 'content' | 'debug' | 'general';

export interface AiAssistantConfig {
  id: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  top_p: number | null;
  frequency_penalty: number;
  presence_penalty: number;
  stop_sequences: string[] | null;
  seed: number | null;
  response_format: string;
  default_persona_id: string | null;
  default_provider: string;
  response_language: string;
  streaming_enabled: boolean;
  custom_instructions: string | null;
}

export interface AiPersona {
  id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  description_ko: string | null;
  system_prompt: string;
  avatar_icon: string;
  avatar_color: string;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  provider: AiProviderSlug | null;
  model: string | null;
  temperature: number | null;
  max_tokens: number | null;
  top_p: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  stop_sequences: string[] | null;
  response_format: string;
  version: number;
  previous_version_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiProviderModel {
  id: string;
  name: string;
  description: string;
  max_tokens: number;
}

export interface AiProvider {
  id: string;
  slug: AiProviderSlug;
  name: string;
  is_enabled: boolean;
  encrypted_api_key: string | null;
  base_url: string | null;
  available_models: AiProviderModel[];
  fallback_provider_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AiGuardrails {
  id: string;
  content_filter_hate: ContentFilterLevel;
  content_filter_violence: ContentFilterLevel;
  content_filter_sexual: ContentFilterLevel;
  content_filter_self_harm: ContentFilterLevel;
  denied_topics: string[];
  blocked_words: string[];
  max_conversation_turns: number;
  max_input_tokens: number;
  pii_detection_enabled: boolean;
  is_active: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiPromptTemplate {
  id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  description_ko: string | null;
  category: TemplateCategory;
  prompt_text: string;
  prompt_text_ko: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiUsageLog {
  id: string;
  user_id: string;
  persona_id: string | null;
  provider: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_time_ms: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface AiUsageSummary {
  total_requests: number;
  total_tokens: number;
  avg_response_time: number;
  error_rate: number;
}
