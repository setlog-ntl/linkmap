import { z } from 'zod';

export const credentialPurposes = ['admin', 'demo', 'deploy', 'monitoring', 'api', 'other'] as const;
export const credentialEnvironments = ['development', 'staging', 'production', 'all'] as const;

export const createCredentialSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid().nullable().optional(),
  label: z
    .string()
    .min(1, '라벨은 필수입니다')
    .max(100, '라벨은 100자 이하'),
  username: z.string().min(1, '아이디는 필수입니다').max(500),
  password: z.string().max(1000).nullable().optional(),
  purpose: z.enum(credentialPurposes).default('other'),
  environment: z.enum(credentialEnvironments).default('all'),
  website_url: z.string().url('유효하지 않은 URL').max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const updateCredentialSchema = z.object({
  id: z.string().uuid('유효하지 않은 계정 정보 ID'),
  label: z.string().min(1).max(100).optional(),
  username: z.string().min(1).max(500).optional(),
  password: z.string().max(1000).optional(),
  purpose: z.enum(credentialPurposes).optional(),
  environment: z.enum(credentialEnvironments).optional(),
  service_id: z.string().uuid().nullable().optional(),
  website_url: z.string().url().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const bulkUpdateCredentialSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, '최소 1개 이상 선택 필요').max(50, '최대 50개까지 일괄 수정 가능'),
  purpose: z.enum(credentialPurposes).optional(),
  environment: z.enum(credentialEnvironments).optional(),
  service_id: z.string().uuid().nullable().optional(),
});

export const bulkDeleteCredentialSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, '최소 1개 이상 선택 필요').max(50, '최대 50개까지 일괄 삭제 가능'),
});

export const exportCredentialSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  ids: z.array(z.string().uuid()).min(1, '최소 1개 이상 선택 필요').max(50, '최대 50개까지 내보내기 가능'),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
export type BulkUpdateCredentialInput = z.infer<typeof bulkUpdateCredentialSchema>;
export type BulkDeleteCredentialInput = z.infer<typeof bulkDeleteCredentialSchema>;
export type ExportCredentialInput = z.infer<typeof exportCredentialSchema>;
