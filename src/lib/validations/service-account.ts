import { z } from 'zod';

export const connectApiKeySchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid('유효하지 않은 서비스 ID'),
  api_keys: z.record(
    z.string().min(1, '키 이름은 필수입니다'),
    z.string().min(1, '값은 필수입니다')
  ).refine((keys) => Object.keys(keys).length > 0, '최소 1개의 API 키가 필요합니다'),
  api_key_label: z.string().max(100).optional(),
});

export const initiateOAuthSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  service_id: z.string().uuid('유효하지 않은 서비스 ID'),
  service_slug: z.string().min(1, '서비스 slug는 필수입니다'),
});

export const verifyAccountSchema = z.object({
  service_account_id: z.string().uuid('유효하지 않은 계정 ID'),
});

export type ConnectApiKeyInput = z.infer<typeof connectApiKeySchema>;
export type InitiateOAuthInput = z.infer<typeof initiateOAuthSchema>;
export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;
