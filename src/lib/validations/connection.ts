import { z } from 'zod';

const connectionTypeEnum = z.enum(
  ['uses', 'integrates', 'data_transfer', 'api_call', 'auth_provider', 'webhook', 'sdk'],
  { error: '유효하지 않은 연결 타입입니다' }
);

const connectionStatusEnum = z.enum(
  ['active', 'inactive', 'error', 'pending'],
  { error: '유효하지 않은 연결 상태입니다' }
);

export const createConnectionSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  source_service_id: z.string().uuid('유효하지 않은 소스 서비스 ID'),
  target_service_id: z.string().uuid('유효하지 않은 타겟 서비스 ID'),
  connection_type: connectionTypeEnum,
  connection_status: connectionStatusEnum.optional().default('active'),
  label: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
}).refine((data) => data.source_service_id !== data.target_service_id, {
  message: '소스와 타겟 서비스가 같을 수 없습니다',
  path: ['target_service_id'],
});

export const updateConnectionSchema = z.object({
  connection_type: connectionTypeEnum.optional(),
  connection_status: connectionStatusEnum.optional(),
  label: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>;
