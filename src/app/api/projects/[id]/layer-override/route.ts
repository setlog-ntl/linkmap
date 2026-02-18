import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

const upsertSchema = z.object({
  service_id: z.string().uuid(),
  dashboard_layer: z.enum(['frontend', 'backend', 'devtools']).optional(),
  dashboard_subcategory: z.string().max(50).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data, error } = await supabase
    .from('project_service_overrides')
    .select('*')
    .eq('project_id', id);

  if (error) return apiError(error.message, 400);
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Verify project ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!project) return notFoundError('프로젝트');

  const { service_id, dashboard_layer, dashboard_subcategory } = parsed.data;

  const { data, error } = await supabase
    .from('project_service_overrides')
    .upsert(
      {
        project_id: id,
        service_id,
        dashboard_layer,
        dashboard_subcategory,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,service_id' }
    )
    .select()
    .single();

  if (error) return apiError(error.message, 400);

  await logAudit(user.id, {
    action: 'layer_override.upsert',
    resourceType: 'project_service_override',
    resourceId: data.id,
    details: { project_id: id, service_id, dashboard_layer, dashboard_subcategory },
  });

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const serviceId = request.nextUrl.searchParams.get('service_id');
  if (!serviceId) return apiError('service_id가 필요합니다', 400);

  const { error } = await supabase
    .from('project_service_overrides')
    .delete()
    .eq('project_id', id)
    .eq('service_id', serviceId);

  if (error) return apiError(error.message, 400);
  return NextResponse.json({ success: true });
}
