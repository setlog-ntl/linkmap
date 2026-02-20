-- Add environment column to user_connections for filtering by deployment environment
ALTER TABLE public.user_connections
  ADD COLUMN IF NOT EXISTS environment TEXT DEFAULT 'all'
  CHECK (environment IN ('development', 'staging', 'production', 'all'));
