import type { Environment } from './core';

export type CredentialPurpose = 'admin' | 'demo' | 'deploy' | 'monitoring' | 'api' | 'other';

export interface ServiceCredential {
  id: string;
  project_id: string;
  service_id: string | null;
  project_service_id?: string | null;
  label: string;
  encrypted_username: string;
  encrypted_password: string | null;
  purpose: CredentialPurpose;
  environment: Environment | 'all';
  website_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
