import { z } from 'zod';

const mcpTransportEnum = z.enum(
  ['stdio', 'sse', 'streamable-http'],
  { error: '유효하지 않은 MCP 전송 방식입니다' }
);

const mcpEnvironmentEnum = z.enum(
  ['development', 'staging', 'production', 'all'],
  { error: '유효하지 않은 환경 값입니다' }
);

const mcpLinkTypeEnum = z.enum(
  ['provides_access', 'reads_from', 'writes_to', 'manages'],
  { error: '유효하지 않은 연결 타입입니다' }
);

// ---------------------------------------------------------------------------
// MCP Config CRUD
// ---------------------------------------------------------------------------

export const createMcpConfigSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  mcp_server_id: z.string().uuid().nullable().optional(),
  custom_name: z.string().max(100).nullable().optional(),
  transport: mcpTransportEnum.optional().default('stdio'),
  command: z.string().max(500).nullable().optional(),
  args: z.array(z.string().max(500)).optional().default([]),
  url: z.string().url('유효하지 않은 URL').nullable().optional(),
  enabled: z.boolean().optional().default(true),
  environment: mcpEnvironmentEnum.optional().default('all'),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  notes: z.string().max(1000).nullable().optional(),
  // env vars to create alongside the config
  env_vars: z.array(z.object({
    key_name: z.string().min(1).max(200),
    value: z.string(),
    description: z.string().max(500).nullable().optional(),
    is_secret: z.boolean().optional().default(true),
    source_env_var_id: z.string().uuid().nullable().optional(),
  })).optional().default([]),
  // service links
  service_links: z.array(z.object({
    service_id: z.string().uuid(),
    project_service_id: z.string().uuid().nullable().optional(),
    link_type: mcpLinkTypeEnum.optional().default('provides_access'),
  })).optional().default([]),
});

export const updateMcpConfigSchema = z.object({
  custom_name: z.string().max(100).nullable().optional(),
  transport: mcpTransportEnum.optional(),
  command: z.string().max(500).nullable().optional(),
  args: z.array(z.string().max(500)).optional(),
  url: z.string().url('유효하지 않은 URL').nullable().optional(),
  enabled: z.boolean().optional(),
  environment: mcpEnvironmentEnum.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(1000).nullable().optional(),
});

// ---------------------------------------------------------------------------
// MCP Import
// ---------------------------------------------------------------------------

export const importMcpConfigSchema = z.object({
  project_id: z.string().uuid('유효하지 않은 프로젝트 ID'),
  content: z.string().min(1, 'MCP 설정 내용이 필요합니다'),
  environment: mcpEnvironmentEnum.optional().default('all'),
});

// ---------------------------------------------------------------------------
// MCP Config Env Var
// ---------------------------------------------------------------------------

export const createMcpEnvVarSchema = z.object({
  key_name: z.string().min(1, '키 이름이 필요합니다').max(200),
  value: z.string(),
  description: z.string().max(500).nullable().optional(),
  is_secret: z.boolean().optional().default(true),
  source_env_var_id: z.string().uuid().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type CreateMcpConfigInput = z.infer<typeof createMcpConfigSchema>;
export type UpdateMcpConfigInput = z.infer<typeof updateMcpConfigSchema>;
export type ImportMcpConfigInput = z.infer<typeof importMcpConfigSchema>;
export type CreateMcpEnvVarInput = z.infer<typeof createMcpEnvVarSchema>;
