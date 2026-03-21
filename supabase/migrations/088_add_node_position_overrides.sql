-- 088: Add position overrides for service nodes in dependency view
-- Allows users to persist custom node positions after drag in edit mode

ALTER TABLE public.project_service_overrides
  ADD COLUMN IF NOT EXISTS position_x NUMERIC(10, 2) NULL,
  ADD COLUMN IF NOT EXISTS position_y NUMERIC(10, 2) NULL;
