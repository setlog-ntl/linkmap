import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { runHealthCheck } from '@/lib/health-check';
import { runHealthCheckSchema } from '@/lib/validations/health-check';
import { unauthorizedError, notFoundError, validationError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { sendEmail } from '@/lib/email/sender';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = runHealthCheckSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { project_service_id, environment } = parsed.data;

    // Verify ownership: project_service → project → user (JOIN 분리로 PGRST201 방지)
    const { data: projectService, error: psError } = await supabase
      .from('project_services')
      .select('*, service:services(*)')
      .eq('id', project_service_id)
      .single();

    if (psError || !projectService) {
      return notFoundError('서비스');
    }

    // 소유권 확인: project_id로 프로젝트 조회
    const { data: project } = await supabase
      .from('projects')
      .select('user_id, name')
      .eq('id', projectService.project_id)
      .single();

    if (!project || project.user_id !== user.id) {
      return notFoundError('서비스');
    }

    const service = projectService.service;
    if (!service) {
      return notFoundError('서비스 카탈로그');
    }

    // Get env vars for this project + service + environment
    const { data: envVars = [] } = await supabase
      .from('environment_variables')
      .select('key_name, encrypted_value')
      .eq('project_id', projectService.project_id)
      .eq('environment', environment);

    // Get required env var names from service catalog
    const requiredEnvVarNames = (service.required_env_vars || []).map(
      (v: { name: string }) => v.name
    );

    // Run health check
    const result = await runHealthCheck({
      serviceSlug: service.slug,
      requiredEnvVarNames,
      encryptedEnvVars: envVars || [],
    });

    // Store result using admin client (bypasses RLS for insert)
    const adminSupabase = createAdminClient();
    const { data: healthCheck, error: insertError } = await adminSupabase
      .from('health_checks')
      .insert({
        project_service_id,
        environment,
        status: result.status,
        message: result.message,
        response_time_ms: result.responseTimeMs,
        details: result.details || {},
        checked_at: result.checkedAt,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save health check result:', insertError);
    }

    // Update project_services status based on health check result
    const newStatus = result.status === 'healthy' ? 'connected' : result.status === 'unhealthy' ? 'error' : projectService.status;
    if (newStatus !== projectService.status) {
      await supabase
        .from('project_services')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', project_service_id);
    }

    // Auto-update connection_status for connections involving this service
    const serviceId = service.id;
    const now = new Date().toISOString();
    if (result.status === 'unhealthy' || result.status === 'degraded') {
      // Service is down → mark related connections as error
      await supabase
        .from('user_connections')
        .update({ connection_status: 'error', last_verified_at: now, updated_at: now })
        .eq('project_id', projectService.project_id)
        .or(`source_service_id.eq.${serviceId},target_service_id.eq.${serviceId}`)
        .is('deleted_at', null);
    } else if (result.status === 'healthy') {
      // Service recovered → restore error-state connections to active
      await supabase
        .from('user_connections')
        .update({ connection_status: 'active', last_verified_at: now, updated_at: now })
        .eq('project_id', projectService.project_id)
        .or(`source_service_id.eq.${serviceId},target_service_id.eq.${serviceId}`)
        .eq('connection_status', 'error')
        .is('deleted_at', null);
    }

    // Send alert email for unhealthy/degraded status
    if (result.status === 'unhealthy' || result.status === 'degraded') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (profile?.email) {
        const sent = await sendEmail({
          type: 'health_alert',
          to: profile.email,
          serviceName: service.name ?? service.slug,
          serviceSlug: service.slug,
          projectName: project.name ?? project_service_id,
          environment,
          status: result.status,
          message: result.message ?? '서비스 상태 이상이 감지되었습니다.',
          checkedAt: result.checkedAt,
        });

        await logAudit(user.id, {
          action: sent ? 'email.health_alert' : 'email.send_failed',
          resourceType: 'project_service',
          resourceId: project_service_id,
          details: { service_slug: service.slug, environment, status: result.status, sent },
        });
      }
    }

    // Audit log
    await logAudit(user.id, {
      action: 'service.health_check',
      resourceType: 'project_service',
      resourceId: project_service_id,
      details: {
        service_slug: service.slug,
        environment,
        status: result.status,
        response_time_ms: result.responseTimeMs,
      },
    });

    return NextResponse.json(healthCheck || {
      project_service_id,
      environment,
      ...result,
    });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const projectServiceId = searchParams.get('project_service_id');
  if (!projectServiceId) {
    return apiError('project_service_id가 필요합니다', 400);
  }

  // Verify ownership (JOIN 분리로 PGRST201 방지)
  const { data: projectService } = await supabase
    .from('project_services')
    .select('*')
    .eq('id', projectServiceId)
    .single();

  if (!projectService) {
    return notFoundError('서비스');
  }

  const { data: ownerProject } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', projectService.project_id)
    .single();

  if (!ownerProject || ownerProject.user_id !== user.id) {
    return notFoundError('서비스');
  }

  const { data: checks, error } = await supabase
    .from('health_checks')
    .select('*')
    .eq('project_service_id', projectServiceId)
    .order('checked_at', { ascending: false })
    .limit(20);

  if (error) {
    return apiError(error.message, 500);
  }

  return NextResponse.json(checks || []);
}
