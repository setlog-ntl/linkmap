-- AI Feature ↔ Persona mapping table
CREATE TABLE IF NOT EXISTS ai_feature_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_slug TEXT NOT NULL UNIQUE,
  persona_id UUID REFERENCES ai_personas(id) ON DELETE SET NULL,
  system_prompt_override TEXT,
  template_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE ai_feature_personas ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "admin_full_access" ON ai_feature_personas
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Authenticated users can read active features
CREATE POLICY "authenticated_read_active" ON ai_feature_personas
  FOR SELECT USING (
    auth.role() = 'authenticated' AND is_active = true
  );

-- Seed 6 features
INSERT INTO ai_feature_personas (feature_slug) VALUES
  ('overview_chat'),
  ('env_doctor'),
  ('map_narrator'),
  ('compare_services'),
  ('command'),
  ('module_suggest')
ON CONFLICT (feature_slug) DO NOTHING;
