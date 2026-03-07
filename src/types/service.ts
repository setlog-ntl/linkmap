import type {
  ServiceCategory,
  ServiceDomain,
  DifficultyLevel,
  FreeTierQuality,
  VendorLockInRisk,
  DependencyType,
  ChangeType,
} from './core';
import type { DashboardLayer } from './dashboard';

export interface EnvVarTemplate {
  name: string;
  public: boolean;
  description: string;
  description_ko?: string;
  /** true면 선택 항목 — 미입력해도 저장 가능 */
  optional?: boolean;
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
  github_stars?: number | null;
  last_updated?: string;
  // Dashboard layer (M027)
  dashboard_layer?: DashboardLayer | null;
  dashboard_subcategory?: string | null;
  // Multi-account support (M031)
  supports_multi_account?: boolean;
  // Custom service fields (M042)
  user_id?: string | null;
  is_custom?: boolean;
  icon_emoji?: string | null;
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

// API 키 발급 단계 (초보자용)
export interface ApiKeyIssueStep {
  step: number;
  title: string;       // 단계 제목
  description: string; // 상세 설명 (UI 경로 힌트 포함)
}

// 서비스 단일 기능 단위
export interface ServiceFeatureGuide {
  id: string;          // 기능 식별자
  name: string;        // 기능명
  description: string; // 기능 설명
  tag?: 'free' | 'paid' | 'beta';
  api_key?: {
    env_var: string;                // 환경변수명
    url: string;                    // 발급 URL
    url_label: string;              // 링크 텍스트
    issue_steps: ApiKeyIssueStep[]; // 발급 단계
  };
  setup_steps?: SetupStep[];        // 이 기능의 설정 단계 (선택)
  code_example?: string;            // 코드 예제 (선택)
}

// 가입 안내
export interface ServiceSignupGuide {
  url: string;        // 가입 URL
  steps: string[];    // 가입 단계 (3~5개 텍스트)
  free_tier?: string; // 무료 플랜 설명
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
  api_key_url: string | null;
  api_key_url_label: string | null;
  updated_at: string;
  // 신규 (v2): 가입 안내 + 기능별 가이드
  signup?: ServiceSignupGuide | null;
  features?: ServiceFeatureGuide[] | null;
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
