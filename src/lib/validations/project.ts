import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, '프로젝트 이름은 필수입니다')
    .max(100, '프로젝트 이름은 100자 이하'),
  description: z.string().max(500).nullable().optional(),
  tech_stack: z.record(z.string(), z.string()).optional().default({}),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  tech_stack: z.record(z.string(), z.string()).optional(),
  main_service_id: z.string().uuid().nullable().optional(),
  icon_type: z.enum(['brand', 'emoji', 'custom']).nullable().optional(),
  icon_value: z.string().max(500).nullable().optional(),
  link_url: z.string().url().max(500).nullable().optional(),
  is_favorited: z.boolean().optional(),
  monthly_budget: z.number().min(0).max(999999.99).nullable().optional(),
  budget_currency: z.enum(['USD', 'KRW']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
