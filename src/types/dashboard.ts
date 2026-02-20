import type { ServiceCategory, ServiceStatus } from './core';
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
