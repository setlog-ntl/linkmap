export type ServiceCategory =
  | 'auth'
  | 'social_login'
  | 'database'
  | 'deploy'
  | 'email'
  | 'payment'
  | 'storage'
  | 'monitoring'
  | 'ai'
  | 'other'
  | 'cdn'
  | 'cicd'
  | 'testing'
  | 'sms'
  | 'push'
  | 'chat'
  | 'search'
  | 'cms'
  | 'analytics'
  | 'media'
  | 'queue'
  | 'cache'
  | 'logging'
  | 'feature_flags'
  | 'scheduling'
  | 'ecommerce'
  | 'serverless'
  | 'code_quality'
  | 'automation';

export type ServiceDomain =
  | 'infrastructure'
  | 'backend'
  | 'devtools'
  | 'communication'
  | 'business'
  | 'ai_ml'
  | 'observability'
  | 'integration';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type FreeTierQuality = 'excellent' | 'good' | 'limited' | 'none';
export type VendorLockInRisk = 'low' | 'medium' | 'high';
export type DependencyType = 'required' | 'recommended' | 'optional' | 'alternative';
export type ChangeType = 'added' | 'updated' | 'deprecated' | 'removed';

export type ServiceStatus = 'not_started' | 'in_progress' | 'connected' | 'error';
export type Environment = 'development' | 'staging' | 'production';
export type HealthCheckStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
export type TeamRole = 'admin' | 'editor' | 'viewer';

export type EasyCategory =
  | 'login_signup'
  | 'data_storage'
  | 'deploy_hosting'
  | 'payments'
  | 'notifications'
  | 'ai_tools'
  | 'dev_tools'
  | 'analytics_other';

export type UserConnectionType = 'uses' | 'integrates' | 'data_transfer' | 'api_call' | 'auth_provider' | 'webhook' | 'sdk';
export type ConnectionStatus = 'active' | 'inactive' | 'error' | 'pending';

export interface UserConnection {
  id: string;
  project_id: string;
  source_service_id: string;
  target_service_id: string;
  connection_type: UserConnectionType;
  connection_status: ConnectionStatus;
  label: string | null;
  description: string | null;
  last_verified_at: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiAssistantConfig {
  id: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  top_p: number | null;
  frequency_penalty: number;
  presence_penalty: number;
  stop_sequences: string[] | null;
  seed: number | null;
  response_format: string;
  default_persona_id: string | null;
  default_provider: string;
  response_language: string;
  streaming_enabled: boolean;
  custom_instructions: string | null;
}

export type AiProviderSlug = 'openai' | 'anthropic' | 'google';
export type ContentFilterLevel = 'off' | 'low' | 'medium' | 'high';
export type TemplateCategory = 'code' | 'design' | 'content' | 'debug' | 'general';

export interface AiPersona {
  id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  description_ko: string | null;
  system_prompt: string;
  avatar_icon: string;
  avatar_color: string;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  provider: AiProviderSlug | null;
  model: string | null;
  temperature: number | null;
  max_tokens: number | null;
  top_p: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  stop_sequences: string[] | null;
  response_format: string;
  version: number;
  previous_version_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiProviderModel {
  id: string;
  name: string;
  description: string;
  max_tokens: number;
}

export interface AiProvider {
  id: string;
  slug: AiProviderSlug;
  name: string;
  is_enabled: boolean;
  encrypted_api_key: string | null;
  base_url: string | null;
  available_models: AiProviderModel[];
  fallback_provider_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AiGuardrails {
  id: string;
  content_filter_hate: ContentFilterLevel;
  content_filter_violence: ContentFilterLevel;
  content_filter_sexual: ContentFilterLevel;
  content_filter_self_harm: ContentFilterLevel;
  denied_topics: string[];
  blocked_words: string[];
  max_conversation_turns: number;
  max_input_tokens: number;
  pii_detection_enabled: boolean;
  is_active: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiPromptTemplate {
  id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  description_ko: string | null;
  category: TemplateCategory;
  prompt_text: string;
  prompt_text_ko: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiUsageLog {
  id: string;
  user_id: string;
  persona_id: string | null;
  provider: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_time_ms: number | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface AiUsageSummary {
  total_requests: number;
  total_tokens: number;
  avg_response_time: number;
  error_rate: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: Record<string, string>;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description: string | null;
  description_ko: string | null;
  icon_url: string | null;
  website_url: string | null;
  docs_url: string | null;
  pricing_info: Record<string, unknown>;
  required_env_vars: EnvVarTemplate[];
  created_at: string;
  // Extended fields (v2)
  domain?: ServiceDomain | null;
  subcategory?: string | null;
  popularity_score?: number;
  difficulty_level?: DifficultyLevel;
  tags?: string[];
  alternatives?: string[];
  compatibility?: { framework?: string[]; language?: string[] };
  official_sdks?: Record<string, string>;
  free_tier_quality?: FreeTierQuality;
  vendor_lock_in_risk?: VendorLockInRisk;
  setup_time_minutes?: number | null;
  monthly_cost_estimate?: Record<string, string>;
  dx_score?: number | null;
  last_updated?: string;
}

export interface EnvVarTemplate {
  name: string;
  public: boolean;
  description: string;
  description_ko?: string;
}

export interface ProjectService {
  id: string;
  project_id: string;
  service_id: string;
  status: ServiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface ChecklistItem {
  id: string;
  service_id: string;
  order_index: number;
  title: string;
  title_ko: string | null;
  description: string | null;
  description_ko: string | null;
  guide_url: string | null;
  created_at: string;
}

export interface UserChecklistProgress {
  id: string;
  project_service_id: string;
  checklist_item_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface EnvironmentVariable {
  id: string;
  project_id: string;
  service_id: string | null;
  key_name: string;
  encrypted_value: string;
  environment: Environment;
  is_secret: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  description_ko: string | null;
  services: string[];
  tech_stack: Record<string, string>;
  is_community: boolean;
  author_id: string | null;
  downloads_count: number;
  created_at: string;
}

export interface ProjectWithServices extends Project {
  project_services: (ProjectService & { service: Service })[];
}

// ============================================
// V2 Extended Types
// ============================================

export interface ServiceDomainRecord {
  id: ServiceDomain;
  name: string;
  name_ko: string;
  description: string | null;
  description_ko: string | null;
  icon_name: string | null;
  order_index: number;
}

export interface ServiceSubcategory {
  id: string;
  category: ServiceCategory;
  name: string;
  name_ko: string;
  description: string | null;
  description_ko: string | null;
}

export interface ServiceDependency {
  id: string;
  service_id: string;
  depends_on_service_id: string;
  dependency_type: DependencyType;
  description: string | null;
  description_ko: string | null;
}

export interface ServiceGuide {
  id: string;
  service_id: string;
  quick_start: string | null;
  quick_start_en: string | null;
  setup_steps: SetupStep[];
  code_examples: Record<string, string>;
  common_pitfalls: CommonPitfall[];
  integration_tips: IntegrationTip[];
  pros: LocalizedText[];
  cons: LocalizedText[];
  updated_at: string;
}

export interface SetupStep {
  step: number;
  title: string;
  title_ko: string;
  description: string;
  description_ko: string;
  code_snippet?: string;
}

export interface CommonPitfall {
  title: string;
  title_ko: string;
  problem: string;
  solution: string;
  code?: string;
}

export interface IntegrationTip {
  with_service_slug: string;
  tip: string;
  tip_ko: string;
  code?: string;
}

export interface LocalizedText {
  text: string;
  text_ko: string;
}

export interface ServiceComparison {
  id: string;
  category: ServiceCategory;
  title: string | null;
  title_ko: string | null;
  services: string[];
  comparison_data: {
    criteria: ComparisonCriterion[];
  };
  recommendation: Record<string, { need: string; choose: string; because: string }>;
  updated_at: string;
}

export interface ComparisonCriterion {
  name: string;
  name_ko: string;
  values: Record<string, string>;
}

export interface ServiceCostTier {
  id: string;
  service_id: string;
  tier_name: string;
  tier_name_ko: string | null;
  price_monthly: string | null;
  price_yearly: string | null;
  features: CostFeature[];
  limits: Record<string, string>;
  recommended_for: string | null;
  order_index: number;
}

export interface CostFeature {
  feature: string;
  feature_ko: string;
  included: boolean;
}

export interface ServiceChangelog {
  id: string;
  service_id: string;
  change_type: ChangeType;
  change_description: string | null;
  change_description_ko: string | null;
  created_at: string;
}

export interface HealthCheck {
  id: string;
  project_service_id: string;
  environment: Environment;
  status: HealthCheckStatus;
  message: string | null;
  response_time_ms: number | null;
  details: Record<string, unknown>;
  checked_at: string;
}

// ============================================
// Service Account Types
// ============================================

export type ServiceAccountConnectionType = 'oauth' | 'api_key' | 'manual';
export type ServiceAccountStatus = 'active' | 'expired' | 'revoked' | 'error';

export interface ServiceAccount {
  id: string;
  project_id: string;
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
  // Status
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
  project_id: string;
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

// ============================================
// Dashboard Types
// ============================================

export type DashboardLayer = 'frontend' | 'backend' | 'devtools';

export type DashboardSubcategory =
  | 'deploy'
  | 'analytics'
  | 'auth'
  | 'social_login'
  | 'database'
  | 'payment'
  | 'email'
  | 'storage'
  | 'hosting'
  | 'ai'
  | 'cicd'
  | 'monitoring'
  | 'ide'
  | 'cache'
  | 'queue'
  | 'testing';

export interface ServiceCardData {
  projectServiceId: string;
  serviceId: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  status: ServiceStatus;
  dashboardLayer: DashboardLayer;
  dashboardSubcategory: DashboardSubcategory | string;
  envTotal: number;
  envFilled: number;
  websiteUrl: string | null;
}

export interface LayerData {
  layer: DashboardLayer;
  label: string;
  services: ServiceCardData[];
}

export interface DashboardMetrics {
  totalServices: number;
  connectedServices: number;
  totalEnvVars: number;
  progressPercent: number;
}

export interface DashboardResponse {
  project: Project;
  layers: LayerData[];
  metrics: DashboardMetrics;
  connections: UserConnection[];
}