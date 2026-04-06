-- ---------------------------------------------------------------------------
-- Migration 095: MCP Server management tables
-- ---------------------------------------------------------------------------

-- 1. MCP Server catalog (shared seed data)
CREATE TABLE public.mcp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_ko TEXT,
  provider TEXT,
  transport TEXT NOT NULL DEFAULT 'stdio'
    CHECK (transport IN ('stdio', 'sse', 'streamable-http')),
  npm_package TEXT,
  command TEXT,
  default_args TEXT[] DEFAULT '{}',
  required_env_vars JSONB DEFAULT '[]',
  icon_url TEXT,
  website_url TEXT,
  docs_url TEXT,
  related_service_ids UUID[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner'
    CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  popularity_score INT DEFAULT 0,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Project-level MCP config instances
CREATE TABLE public.project_mcp_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  mcp_server_id UUID REFERENCES public.mcp_servers(id) ON DELETE SET NULL,
  custom_name TEXT,
  transport TEXT NOT NULL DEFAULT 'stdio'
    CHECK (transport IN ('stdio', 'sse', 'streamable-http')),
  command TEXT,
  args TEXT[] DEFAULT '{}',
  url TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  environment TEXT NOT NULL DEFAULT 'all'
    CHECK (environment IN ('development', 'staging', 'production', 'all')),
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 3. MCP config environment variables (encrypted)
CREATE TABLE public.mcp_config_env_vars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcp_config_id UUID NOT NULL REFERENCES public.project_mcp_configs(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  description TEXT,
  is_secret BOOLEAN NOT NULL DEFAULT true,
  source_env_var_id UUID REFERENCES public.environment_variables(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. MCP-to-Service links
CREATE TABLE public.mcp_service_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcp_config_id UUID NOT NULL REFERENCES public.project_mcp_configs(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  project_service_id UUID REFERENCES public.project_services(id) ON DELETE SET NULL,
  link_type TEXT NOT NULL DEFAULT 'provides_access'
    CHECK (link_type IN ('provides_access', 'reads_from', 'writes_to', 'manages')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(mcp_config_id, service_id)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_mcp_servers_slug ON public.mcp_servers(slug);
CREATE INDEX idx_mcp_servers_tags ON public.mcp_servers USING GIN(tags);
CREATE INDEX idx_project_mcp_configs_project ON public.project_mcp_configs(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_project_mcp_configs_server ON public.project_mcp_configs(mcp_server_id);
CREATE INDEX idx_mcp_config_env_vars_config ON public.mcp_config_env_vars(mcp_config_id);
CREATE INDEX idx_mcp_service_links_config ON public.mcp_service_links(mcp_config_id);
CREATE INDEX idx_mcp_service_links_service ON public.mcp_service_links(service_id);

-- ---------------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------------

-- mcp_servers: readable by all authenticated users (catalog data)
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mcp_servers_select" ON public.mcp_servers
  FOR SELECT TO authenticated USING (true);

-- Only admins can insert/update/delete catalog entries
CREATE POLICY "mcp_servers_admin_insert" ON public.mcp_servers
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "mcp_servers_admin_update" ON public.mcp_servers
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "mcp_servers_admin_delete" ON public.mcp_servers
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- project_mcp_configs: project owner or team member
ALTER TABLE public.project_mcp_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_mcp_configs_select" ON public.project_mcp_configs
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid()
      WHERE p.id = project_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "project_mcp_configs_insert" ON public.project_mcp_configs
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE p.id = project_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "project_mcp_configs_update" ON public.project_mcp_configs
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE p.id = project_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "project_mcp_configs_delete" ON public.project_mcp_configs
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE p.id = project_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

-- mcp_config_env_vars: inherits access from parent config's project
ALTER TABLE public.mcp_config_env_vars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mcp_config_env_vars_select" ON public.mcp_config_env_vars
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid()
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "mcp_config_env_vars_insert" ON public.mcp_config_env_vars
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "mcp_config_env_vars_update" ON public.mcp_config_env_vars
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "mcp_config_env_vars_delete" ON public.mcp_config_env_vars
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

-- mcp_service_links: inherits access from parent config's project
ALTER TABLE public.mcp_service_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mcp_service_links_select" ON public.mcp_service_links
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid()
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "mcp_service_links_insert" ON public.mcp_service_links
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

CREATE POLICY "mcp_service_links_delete" ON public.mcp_service_links
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.project_mcp_configs c
      JOIN public.projects p ON p.id = c.project_id
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid() AND tm.role IN ('admin', 'editor')
      WHERE c.id = mcp_config_id AND (p.user_id = auth.uid() OR tm.user_id IS NOT NULL)
    )
  );

-- ---------------------------------------------------------------------------
-- Updated_at trigger (reuse existing function if available)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END $$;

CREATE TRIGGER set_updated_at_mcp_servers
  BEFORE UPDATE ON public.mcp_servers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_project_mcp_configs
  BEFORE UPDATE ON public.project_mcp_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_updated_at_mcp_config_env_vars
  BEFORE UPDATE ON public.mcp_config_env_vars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
