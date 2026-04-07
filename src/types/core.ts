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
  | 'automation'
  | 'domain'
  | 'advertising'
  | 'sns';

export type ServiceDomain =
  | 'infrastructure'
  | 'backend'
  | 'devtools'
  | 'communication'
  | 'business'
  | 'ai_ml'
  | 'observability'
  | 'integration'
  | 'sns';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type FreeTierQuality = 'excellent' | 'good' | 'limited' | 'none';
export type VendorLockInRisk = 'low' | 'medium' | 'high';
export type DependencyType = 'required' | 'recommended' | 'optional' | 'alternative';
export type ChangeType = 'added' | 'updated' | 'deprecated' | 'removed';

export type ServiceStatus = 'not_started' | 'in_progress' | 'connected' | 'error';
export type Environment = 'development' | 'staging' | 'production';
export type HealthCheckStatus = 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
export type TeamRole = 'admin' | 'editor' | 'viewer';

export type ViewGroup = 'core' | 'runtime' | 'growth' | 'intelligence' | 'infra';
export type ViewLevel = 'map' | 'dependency';

export type EasyCategory =
  | 'login_signup'
  | 'data_storage'
  | 'deploy_hosting'
  | 'payments'
  | 'notifications'
  | 'ai_tools'
  | 'dev_tools'
  | 'sns'
  | 'analytics_other';

export type SubscriptionPlan = 'free' | 'pro' | 'team';
export type IconType = 'brand' | 'emoji' | 'custom';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentProvider = 'none' | 'stripe' | 'polar';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  payment_provider: PaymentProvider;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';
export type RefundReason = 'customer_request' | 'satisfaction_guarantee' | 'duplicate' | 'fraudulent' | 'other';

export interface RefundHistory {
  id: string;
  user_id: string;
  polar_subscription_id: string | null;
  polar_order_id: string | null;
  polar_refund_id: string | null;
  amount: number;
  currency: string;
  reason: RefundReason;
  status: RefundStatus;
  requested_at: string;
  processed_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanQuota {
  plan: SubscriptionPlan;
  max_projects: number;
  max_env_vars_per_project: number;
  max_services_per_project: number;
  max_team_members: number;
  max_homepage_deploys: number;
}

export interface ApiToken {
  id: string;
  user_id: string;
  name: string;
  token_hash: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface HomepageTemplate {
  id: string;
  slug: string;
  name: string;
  name_ko: string | null;
  description: string | null;
  preview_image_url: string | null;
  github_owner: string;
  github_repo: string;
  default_branch: string;
  framework: string;
  required_env_vars: Record<string, unknown>[];
  tags: string[];
  deploy_target: string | null;
  is_premium: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageDeploy {
  id: string;
  user_id: string;
  project_id: string | null;
  template_id: string;
  forked_repo_full_name: string | null;
  forked_repo_url: string | null;
  fork_status: string;
  deploy_method: string;
  pages_url: string | null;
  pages_status: string | null;
  deploy_status: string;
  deploy_error_message: string | null;
  site_name: string | null;
  custom_domain: string | null;
  config_data: Record<string, unknown>;
  is_showcase: boolean;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  showcase_image_url: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  deployed_at: string | null;
}

export interface ShowcaseLike {
  id: string;
  showcase_id: string;
  showcase_source: 'deploy' | 'project';
  user_id: string;
  created_at: string;
}

export interface ShowcaseComment {
  id: string;
  showcase_id: string;
  showcase_source: 'deploy' | 'project';
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
  } | null;
}

export type ShowcaseCategory =
  | 'portfolio'
  | 'business'
  | 'blog'
  | 'landing'
  | 'community'
  | 'ecommerce'
  | 'other';

export type ShowcaseBadgeType =
  | 'monthly_winner'
  | 'monthly_runner_up'
  | 'editors_choice'
  | 'popular_creator'
  | 'prolific_creator'
  | 'community_star'
  | 'first_showcase';

export type ShowcasePickType = 'algorithm' | 'curated';

export type ShowcaseAdminActionType =
  | 'boost'
  | 'suppress'
  | 'hide'
  | 'unhide'
  | 'feature'
  | 'unfeature';

export type LeaderboardPeriod = 'week' | 'month' | 'all';

export interface MonthlyPick {
  id: string;
  showcase_id: string;
  showcase_source: 'deploy' | 'project';
  year_month: string;
  pick_type: ShowcasePickType;
  rank: number;
  admin_note: string | null;
  picked_by: string | null;
  score_snapshot: number | null;
  created_at: string;
  showcase?: ShowcaseItemWithScore;
}

export interface ShowcaseBadge {
  id: string;
  user_id: string;
  badge_type: ShowcaseBadgeType;
  showcase_id: string | null;
  year_month: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AdminAction {
  id: string;
  showcase_id: string;
  showcase_source: 'deploy' | 'project';
  action_type: ShowcaseAdminActionType;
  boost_score: number;
  reason: string | null;
  admin_id: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ShowcaseItemWithScore {
  id: string;
  site_name: string;
  pages_url: string | null;
  deployment_url: string | null;
  deploy_method: string | null;
  deployed_at: string | null;
  created_at: string;
  user_id: string;
  showcase_description: string | null;
  showcase_tags: string[];
  showcase_category: ShowcaseCategory | null;
  showcase_image_url: string | null;
  like_count: number;
  comment_count: number;
  view_count: number;
  score: number;
  source?: 'deploy' | 'project';
  project_icon_type?: string | null;
  project_icon_value?: string | null;
  homepage_templates: {
    id: string;
    slug: string;
    name: string;
    name_ko: string;
    framework: string;
    preview_image_url: string | null;
  } | null;
  profiles: {
    name: string | null;
    avatar_url: string | null;
  } | null;
  badges?: ShowcaseBadge[];
}

export const SHOWCASE_CATEGORIES: { value: ShowcaseCategory; label: string }[] = [
  { value: 'portfolio', label: '포트폴리오' },
  { value: 'business', label: '비즈니스' },
  { value: 'blog', label: '블로그' },
  { value: 'landing', label: '랜딩페이지' },
  { value: 'community', label: '커뮤니티' },
  { value: 'ecommerce', label: '쇼핑몰' },
  { value: 'other', label: '기타' },
];
