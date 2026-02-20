export type ServiceAccountConnectionType = 'oauth' | 'api_key' | 'manual';
export type ServiceAccountStatus = 'active' | 'expired' | 'revoked' | 'error';
export type ServiceAccountAuthMethod = 'oauth' | 'pat' | 'github_app' | 'deploy_key';

export interface ServiceAccount {
  id: string;
  project_id: string | null;
  service_id: string;
  user_id: string;
  connection_type: ServiceAccountConnectionType;
  // OAuth fields (encrypted, not returned to client)
  token_expires_at: string | null;
  oauth_scopes: string[] | null;
  oauth_provider_user_id: string | null;
  oauth_metadata: Record<string, unknown>;
  // API Key fields
  api_key_label: string | null;
  // Multi-account support
  display_name: string | null;
  auth_method: ServiceAccountAuthMethod;
  multi_account_provider: boolean;
  // Status
  status: ServiceAccountStatus;
  last_verified_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/** GitHub connection summary for settings page (no encrypted fields) */
export interface GitHubConnection {
  id: string;
  user_id: string;
  display_name: string | null;
  auth_method: ServiceAccountAuthMethod;
  oauth_provider_user_id: string | null;
  oauth_metadata: Record<string, unknown>;
  oauth_scopes: string[] | null;
  status: ServiceAccountStatus;
  last_verified_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Linked Account / Resource Domain Types
// ============================================

/**
 * 외부 서비스(예: GitHub, Vercel)의 연결된 계정 도메인 객체.
 *
 * - DB 테이블: service_accounts
 * - 용도: UI 및 API에서 계정 정보를 일관된 형태로 다룰 때 사용
 */
export interface LinkedAccount {
  id: string;
  project_id: string | null;
  service_id: string;
  user_id: string;
  /** 예: 'github', 'vercel' 등 (service slug 또는 provider) */
  provider: string | null;
  /** OAuth provider 상의 사용자 ID (예: GitHub user id) */
  external_user_id: string | null;
  /** 화면에 보여줄 이름 (이름 > 로그인 아이디 순으로 사용) */
  display_name: string | null;
  /** 프로필 이미지 URL (가능한 경우) */
  avatar_url: string | null;
  /** 이메일 (가능한 경우) */
  email: string | null;
  connection_type: ServiceAccountConnectionType;
  status: ServiceAccountStatus;
  last_verified_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 외부 서비스 계정 하위의 연결된 리소스 도메인 객체.
 *
 * GitHub의 경우:
 * - resource_type: 'github_repo'
 * - external_id: repo_full_name (예: owner/repo)
 */
export interface LinkedResource {
  id: string;
  project_id: string;
  service_account_id: string;
  /** 예: 'github_repo', 'vercel_project' 등 */
  resource_type: string;
  /** 외부 서비스에서 고유하게 식별 가능한 ID (예: repo_full_name, project_id) */
  external_id: string;
  /** UI에서 표시할 이름 */
  display_name: string;
  /** 서비스별 추가 정보 (owner, default_branch, auto_sync_enabled 등) */
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ServiceOAuthConfig {
  provider: string;
  authorization_url: string;
  token_url: string;
  scopes: string[];
}

export interface ApiKeyFieldConfig {
  name: string;
  label: string;
  label_ko: string;
  placeholder: string;
  is_required: boolean;
  help_url?: string;
}

export interface ServiceConnectionConfig {
  capabilities: ServiceAccountConnectionType[];
  primary: ServiceAccountConnectionType;
  oauth_config?: ServiceOAuthConfig;
  api_key_fields?: ApiKeyFieldConfig[];
  verify_url?: string;
  description_ko?: string;
}
