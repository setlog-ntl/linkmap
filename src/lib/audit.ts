import { createAdminClient } from '@/lib/supabase/admin';

export type AuditAction =
  | 'env_var.create'
  | 'env_var.update'
  | 'env_var.delete'
  | 'env_var.decrypt'
  | 'env_var.bulk_create'
  | 'env_var.bulk_decrypt'
  | 'env_var.download'
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'connection.create'
  | 'connection.update'
  | 'connection.delete'
  | 'connection.verify'
  | 'service.health_check'
  | 'service_account.connect_oauth'
  | 'service_account.connect_api_key'
  | 'service_account.disconnect'
  | 'service_account.verify'
  | 'github.repo_link'
  | 'github.repo_unlink'
  | 'github.secrets_push'
  | 'github.auto_sync'
  | 'oneclick.deploy_pages'
  | 'oneclick.deploy_success'
  | 'oneclick.deploy_error'
  | 'oneclick.redeploy'
  | 'admin.setup_templates'
  | 'admin.ai_config_update'
  | 'admin.ai_persona_create'
  | 'admin.ai_persona_update'
  | 'admin.ai_persona_delete'
  | 'admin.ai_provider_update'
  | 'admin.ai_guardrails_update'
  | 'admin.ai_template_create'
  | 'admin.ai_template_update'
  | 'admin.ai_template_delete'
  | 'admin.ai_playground_test'
  | 'oneclick.deploy_delete'
  | 'oneclick.file_edit'
  | 'oneclick.file_create'
  | 'oneclick.batch_update'
  | 'oneclick.deploy_rename'
  | 'oneclick.image_upload'
  | 'connection.auto_create'
  | 'layer_override.upsert'
  | 'env_var.conflict_scan'
  | 'env_var.conflict_resolve'
  | 'env_var.sync_services'
  | 'team_member.add'
  | 'team_member.remove'
  | 'ai.stack_recommend'
  | 'ai.env_doctor'
  | 'ai.map_narrate'
  | 'ai.compare_services'
  | 'ai.command'
  | 'ai.cost_report'
  | 'github_connection.add'
  | 'github_connection.delete'
  | 'github_connection.rename'
  | 'github_connection.disconnect'
  | 'project.set_main_service'
  | 'project.set_icon'
  | 'project.toggle_favorite'
  | 'profile.update'
  | 'github_connection.toggle_status'
  | 'service_account.toggle_status'
  | 'ai.chat'
  | 'admin.ai_feature_persona_update'
  | 'admin.ai_feature_qna_create'
  | 'admin.ai_feature_qna_update'
  | 'admin.ai_feature_qna_delete'
  | 'admin.ai_feature_preset_apply'
  | 'custom_service.create'
  | 'custom_service.update'
  | 'custom_service.delete'
  | 'custom_service.migrate'
  | 'ai.module_quick_edit'
  | 'ai.module_inline_polish'
  | 'payment.checkout_initiated'
  | 'payment.checkout_complete'
  | 'payment.subscription_updated'
  | 'payment.subscription_canceled'
  | 'payment.portal_access'
  | 'payment.invoice_failed'
  | 'email.welcome'
  | 'email.health_alert'
  | 'email.team_invite'
  | 'email.subscription_change'
  | 'email.send_failed'
  | 'account.delete'
  | 'project.restore'
  | 'project.permanently_delete'
  | 'env_var.restore'
  | 'env_var.permanently_delete'
  | 'connection.restore'
  | 'connection.permanently_delete'
  | 'trash.empty'
  | 'service_cost.update'
  | 'project.budget_update'
  | 'service_cost.usage_sync'
  | 'service_cost.api_key_save'
  | 'cost_attachment.upload'
  | 'cost_attachment.delete'
  | 'cost_attachment.link_add'
  | 'admin.users_stats_view'
  | 'admin.usage_stats_view'
  | 'admin.visitors_stats_view'
  | 'feedback.create'
  | 'feedback.update'
  | 'feedback.delete'
  | 'feedback.admin_update'
  | 'feedback.comment_create'
  | 'credential.create'
  | 'credential.update'
  | 'credential.delete'
  | 'credential.decrypt';

interface AuditLogEntry {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export async function logAudit(userId: string, entry: AuditLogEntry) {
  try {
    const supabase = createAdminClient();
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
