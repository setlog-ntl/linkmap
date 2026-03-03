import type { ServiceCategory, ServiceStatus, ViewGroup, HealthCheckStatus } from './core';
import type { Project } from './project';
import type { UserConnection } from './connection';

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
  monthlyCost?: number;
  tierName?: string;
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
  totalMonthlyCost?: number;
  monthlyBudget?: number | null;
  isOverBudget?: boolean;
}

export interface DashboardResponse {
  project: Project;
  layers: LayerData[];
  metrics: DashboardMetrics;
  connections: UserConnection[];
  /** SSR에서 주입하는 초기 헬스체크 데이터 (데모·서버 프리로드 용) */
  healthChecks?: Record<string, { status: HealthCheckStatus }>;
}

export interface ViewGroupData {
  group: ViewGroup;
  label: string;
  icon: string;
  services: ServiceCardData[];
}

export interface ProjectCostSummary {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  monthlyBudget: number | null;
  budgetCurrency: 'USD' | 'KRW';
  isOverBudget: boolean;
  budgetUsagePercent: number | null;
  services: ServiceCostEntry[];
}

export interface ServiceCostEntry {
  projectServiceId: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  costTierId: string | null;
  tierName: string | null;
  tierNameKo: string | null;
  monthlyCost: number;
  billingCycle: string;
  costNotes: string | null;
  isCustomCost: boolean;
  actualCostMonthly: number | null;
  usageSyncedAt: string | null;
}

export interface HealthScore {
  overall: number;
  breakdown: {
    connected: number;
    healthy: number;
    envComplete: number;
  };
}

export interface OpenAIModelUsage {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface OpenAIUsageSummary {
  projectServiceId: string;
  hasApiKey: boolean;
  periodStart: string | null;
  periodEnd: string | null;
  totalCost: number | null;
  syncedAt: string | null;
  byModel: OpenAIModelUsage[];
}

export type AttachmentType = 'invoice' | 'receipt' | 'contract' | 'screenshot' | 'other';

export interface CostAttachment {
  id: string;
  projectServiceId: string;
  fileName: string;
  storagePath: string | null;  // 링크일 때 null
  fileSize: number | null;     // 링크일 때 null
  fileType: string | null;     // 링크일 때 null
  attachmentType: AttachmentType;
  notes: string | null;
  uploadedBy: string;
  createdAt: string;
  linkUrl?: string | null;     // 링크 전용
  linkTitle?: string | null;
  /** 서명된 다운로드 URL (API 응답에만 포함, 파일 전용) */
  signedUrl?: string;
}
