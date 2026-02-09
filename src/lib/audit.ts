import { createClient } from '@/lib/supabase/server';

export type AuditAction =
  | 'env_var.create'
  | 'env_var.update'
  | 'env_var.delete'
  | 'env_var.decrypt'
  | 'project.create'
  | 'project.update'
  | 'project.delete';

interface AuditLogEntry {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(userId: string, entry: AuditLogEntry) {
  try {
    const supabase = await createClient();
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error('Audit log failed:', error);
  }
}
