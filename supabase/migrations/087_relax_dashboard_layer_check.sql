-- 087: Relax dashboard_layer CHECK constraint to support custom zones
-- Previously only 'frontend', 'backend', 'devtools' were allowed.
-- Now any string up to 50 chars is accepted for custom zone keys.

ALTER TABLE public.project_service_overrides
  DROP CONSTRAINT IF EXISTS project_service_overrides_dashboard_layer_check;

ALTER TABLE public.project_service_overrides
  ADD CONSTRAINT project_service_overrides_dashboard_layer_check
  CHECK (dashboard_layer IS NULL OR char_length(dashboard_layer) <= 50);
