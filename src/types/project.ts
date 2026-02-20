import type { ServiceStatus } from './core';
import type { Service } from './service';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: Record<string, string>;
  team_id: string | null;
  main_service_id: string | null;
  created_at: string;
  updated_at: string;
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
  project_github_repos?: { id: string }[];
}
