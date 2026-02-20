import type {
  ServiceCategory,
  ServiceDomain,
  DifficultyLevel,
  FreeTierQuality,
  VendorLockInRisk,
  DependencyType,
  ChangeType,
} from './core';

export interface EnvVarTemplate {
  name: string;
  public: boolean;
  description: string;
  description_ko?: string;
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
