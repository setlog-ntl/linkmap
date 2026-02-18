-- 029: Project-level service layer overrides
-- Allows users to customize which layer/subcategory a service appears in per project

CREATE TABLE public.project_service_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  dashboard_layer TEXT CHECK (dashboard_layer IN ('frontend', 'backend', 'devtools')),
  dashboard_subcategory TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_project_service_overrides_project ON public.project_service_overrides(project_id);

-- RLS
ALTER TABLE public.project_service_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project owner full access on overrides"
  ON public.project_service_overrides
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_service_overrides.project_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Team editor+ access on overrides"
  ON public.project_service_overrides
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_service_overrides.project_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Team viewer read on overrides"
  ON public.project_service_overrides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = project_service_overrides.project_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'viewer'
    )
  );
