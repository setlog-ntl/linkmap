-- 028: Enhance user_connections with status, description, metadata
-- Non-destructive: preserves existing connection_type values, adds new ones

-- Add new columns
ALTER TABLE public.user_connections ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'active'
  CHECK (connection_status IN ('active', 'inactive', 'error', 'pending'));

ALTER TABLE public.user_connections ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.user_connections ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

ALTER TABLE public.user_connections ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Extend connection_type CHECK constraint (drop old, add new with more values)
ALTER TABLE public.user_connections DROP CONSTRAINT IF EXISTS user_connections_connection_type_check;
ALTER TABLE public.user_connections ADD CONSTRAINT user_connections_connection_type_check
  CHECK (connection_type IN ('uses', 'integrates', 'data_transfer', 'api_call', 'auth_provider', 'webhook', 'sdk'));

-- Index for connection_status filtering
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON public.user_connections(connection_status);
