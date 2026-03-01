import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateServiceCostSchema } from '@/lib/validations/cost';
import {
  unauthorizedError,
  notFoundError,
  validationError,
  serverError,
} from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; psId: string }> }
) {
  const { id, psId } = await params;
  const supabase = await createClient();

  // 1. getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Zod safeParse
  const body = await request.json();
  const parsed = updateServiceCostSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // 3. 소유권 확인 (project → user_id)
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (!project) return notFoundError('프로젝트');

  const { data: ps } = await supabase
    .from('project_services')
    .select('id')
    .eq('id', psId)
    .eq('project_id', id)
    .single();
  if (!ps) return notFoundError('프로젝트 서비스');

  // 4. 비즈니스 로직 — cost 필드 업데이트
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.cost_tier_id !== undefined) {
    updateData.cost_tier_id = parsed.data.cost_tier_id;
    // tier 선택 시 커스텀 금액 초기화
    if (parsed.data.cost_tier_id) {
      updateData.custom_cost_monthly = null;
      updateData.custom_cost_yearly = null;
    }
  }
  if (parsed.data.custom_cost_monthly !== undefined) {
    updateData.custom_cost_monthly = parsed.data.custom_cost_monthly;
    // 커스텀 금액 설정 시 tier 초기화
    if (parsed.data.custom_cost_monthly != null) {
      updateData.cost_tier_id = null;
    }
  }
  if (parsed.data.custom_cost_yearly !== undefined) {
    updateData.custom_cost_yearly = parsed.data.custom_cost_yearly;
  }
  if (parsed.data.cost_notes !== undefined) {
    updateData.cost_notes = parsed.data.cost_notes;
  }
  if (parsed.data.billing_cycle !== undefined) {
    updateData.billing_cycle = parsed.data.billing_cycle;
  }

  const { data, error } = await supabase
    .from('project_services')
    .update(updateData)
    .eq('id', psId)
    .select()
    .single();

  if (error) return serverError(error.message);

  // 5. logAudit
  await logAudit(user.id, {
    action: 'service_cost.update',
    resourceType: 'project_service',
    resourceId: psId,
    details: {
      project_id: id,
      updated_fields: Object.keys(parsed.data),
    },
  });

  return NextResponse.json(data);
}
