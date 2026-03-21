-- Zone 레이아웃 영속성: zone 구성, 연결, 위치/크기, 프리셋을 프로젝트별 저장
CREATE TABLE IF NOT EXISTS project_zone_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  zone_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_project_zone_layouts_project UNIQUE (project_id)
);

-- RLS
ALTER TABLE project_zone_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own zone layouts"
  ON project_zone_layouts FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own zone layouts"
  ON project_zone_layouts FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own zone layouts"
  ON project_zone_layouts FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own zone layouts"
  ON project_zone_layouts FOR DELETE
  USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

COMMENT ON TABLE project_zone_layouts IS 'Zone 레이아웃 설정 (zone 구성, 연결, 위치/크기, 프리셋)';
COMMENT ON COLUMN project_zone_layouts.zone_data IS 'JSON: {zoneConfigs, zoneConnections, zonePositionOverrides, zoneSizeOverrides, layoutPreset}';
