// Database row types for Supabase queries
// These match the actual database schema and avoid the need for `as` type casting

export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: Record<string, string>;
  team_id: string | null;
  main_service_id: string | null;
  icon_type: string | null;
  icon_value: string | null;
  link_url: string | null;
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

export interface DbServiceCredential {
  id: string;
  project_id: string;
  service_id: string | null;
  label: string;
  encrypted_username: string;
  encrypted_password: string | null;
  purpose: string;
  environment: string;
  website_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCredentialWithProject extends DbServiceCredential {
  project: { user_id: string };
}

export interface DbSecureNote {
  id: string;
  project_id: string;
  service_id: string | null;
  title: string;
  category: string;
  encrypted_content: string;
  environment: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSecureNoteWithProject extends DbSecureNote {
  project: { user_id: string };
}
