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
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
