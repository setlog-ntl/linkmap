// Database row types for Supabase queries
// These match the actual database schema and avoid the need for `as` type casting

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface DbEnvironmentVariable {
  id: string;
  project_id: string;
  service_id: string | null;
  key_name: string;
  encrypted_value: string;
  environment: string;
  is_secret: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbEnvVarWithProject extends DbEnvironmentVariable {
  project: { user_id: string };
}
