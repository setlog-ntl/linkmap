import { z } from 'zod';

export const secureNoteCategories = [
  'backup_code',
  'password',
  'recovery_phrase',
  'license_key',
  'connection_string',
  'pin',
  'api_note',
  'other',
] as const;

export const secureNoteEnvironments = ['development', 'staging', 'production', 'all'] as const;

export const createSecureNoteSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이하'),
  category: z.enum(secureNoteCategories).default('other'),
  content: z.string().min(1, '내용은 필수입니다').max(20000, '내용은 20,000자를 초과할 수 없습니다'),
  environment: z.enum(secureNoteEnvironments).default('all'),
  notes: z.string().max(1000).nullable().optional(),
});

export const updateSecureNoteSchema = z.object({
  id: z.string().uuid('유효하지 않은 보안 메모 ID'),
  title: z.string().min(1).max(200).optional(),
  category: z.enum(secureNoteCategories).optional(),
  content: z.string().min(1).max(20000).optional(),
  environment: z.enum(secureNoteEnvironments).optional(),
  service_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type CreateSecureNoteInput = z.infer<typeof createSecureNoteSchema>;
export type UpdateSecureNoteInput = z.infer<typeof updateSecureNoteSchema>;
