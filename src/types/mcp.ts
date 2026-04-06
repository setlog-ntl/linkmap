// ---------------------------------------------------------------------------
// MCP (Model Context Protocol) domain types
// ---------------------------------------------------------------------------

export type McpTransport = 'stdio' | 'sse' | 'streamable-http';
export type McpLinkType = 'provides_access' | 'reads_from' | 'writes_to' | 'manages';

/** Env var template for MCP server catalog */
export interface McpEnvVarTemplate {
  name: string;
  description: string;
  description_ko?: string;
  optional?: boolean;
}

/** MCP server catalog entry (shared seed data) */
export interface McpServer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_ko: string | null;
  provider: string | null;
  transport: McpTransport;
  npm_package: string | null;
  command: string | null;
  default_args: string[];
  required_env_vars: McpEnvVarTemplate[];
  icon_url: string | null;
  website_url: string | null;
  docs_url: string | null;
  related_service_ids: string[];
  tags: string[];
  difficulty_level: string;
  popularity_score: number;
  is_official: boolean;
  created_at: string;
  updated_at: string;
}

/** User's MCP config instance within a project */
export interface ProjectMcpConfig {
  id: string;
  project_id: string;
  mcp_server_id: string | null;
  mcp_server?: McpServer;
  custom_name: string | null;
  transport: McpTransport;
  command: string | null;
  args: string[];
  url: string | null;
  enabled: boolean;
  environment: string;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Encrypted env var bound to an MCP config */
export interface McpConfigEnvVar {
  id: string;
  mcp_config_id: string;
  key_name: string;
  encrypted_value: string;
  description: string | null;
  is_secret: boolean;
  source_env_var_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Link between an MCP config and a service it accesses */
export interface McpServiceLink {
  id: string;
  mcp_config_id: string;
  service_id: string;
  project_service_id: string | null;
  link_type: McpLinkType;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Seed type (omit auto-generated fields)
// ---------------------------------------------------------------------------

export interface McpServerSeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  description_ko: string;
  provider: string;
  transport: McpTransport;
  npm_package: string | null;
  command: string;
  default_args: string[];
  required_env_vars: McpEnvVarTemplate[];
  icon_url: string | null;
  website_url: string | null;
  docs_url: string | null;
  related_service_ids: string[];
  tags: string[];
  difficulty_level: string;
  popularity_score: number;
  is_official: boolean;
}
