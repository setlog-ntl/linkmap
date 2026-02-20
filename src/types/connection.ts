export type UserConnectionType = 'uses' | 'integrates' | 'data_transfer' | 'api_call' | 'auth_provider' | 'webhook' | 'sdk';
export type ConnectionStatus = 'active' | 'inactive' | 'error' | 'pending';

export type ConnectionEnvironment = 'development' | 'staging' | 'production' | 'all';

export interface UserConnection {
  id: string;
  project_id: string;
  source_service_id: string;
  target_service_id: string;
  connection_type: UserConnectionType;
  connection_status: ConnectionStatus;
  environment?: ConnectionEnvironment;
  label: string | null;
  description: string | null;
  last_verified_at: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
}
