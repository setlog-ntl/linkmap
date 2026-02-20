import { z } from 'zod';

export const aiChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(10000),
});

export const aiChatSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1).max(100),
  project_id: z.string().uuid(),
  feature_slug: z
    .enum([
      'overview_chat',
      'env_doctor',
      'map_narrator',
      'compare_services',
      'command',
      'module_suggest',
    ])
    .default('overview_chat'),
  context: z
    .object({
      services: z.array(z.string()).optional(),
      env_count: z.number().optional(),
      connections_count: z.number().optional(),
    })
    .optional(),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;

export const aiFeaturePersonaUpdateSchema = z.object({
  feature_slug: z.string().min(1),
  persona_id: z.string().uuid().nullable(),
  system_prompt_override: z.string().max(5000).nullable(),
  template_ids: z.array(z.string().uuid()).max(10),
  is_active: z.boolean().optional(),
});

export type AiFeaturePersonaUpdateInput = z.infer<typeof aiFeaturePersonaUpdateSchema>;
