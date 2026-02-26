-- Migration 051: Add composite index to audit_logs for resource+time queries
-- Existing index: idx_audit_logs_resource ON (resource_type, resource_id)
-- New index adds created_at DESC for efficient time-ordered resource lookups
-- (e.g. "latest events for this resource")

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_resource_time
  ON audit_logs(resource_type, resource_id, created_at DESC);
