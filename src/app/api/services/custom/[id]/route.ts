import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, validationError, serverError } from '@/lib/api/errors';
import { updateCustomServiceSchema } from '@/lib/validations/custom-service';
import { logAudit } from '@/lib/audit';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 소유권 확인
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('id, user_id, is_custom')
    .eq('id', id)
    .eq('is_custom', true)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) return notFoundError('커스텀 서비스');

  const body = await request.json();
  const parsed = updateCustomServiceSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.description !== undefined) {
    updateData.description = parsed.data.description || null;
    updateData.description_ko = parsed.data.description || null;
  }
  if (parsed.data.icon_emoji !== undefined) updateData.icon_emoji = parsed.data.icon_emoji || null;
  if (parsed.data.website_url !== undefined) updateData.website_url = parsed.data.website_url || null;
  if (parsed.data.docs_url !== undefined) updateData.docs_url = parsed.data.docs_url || null;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ service: existing });
  }

  const { data, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'custom_service.update',
    resourceType: 'service',
    resourceId: id,
    details: updateData,
  });

  return NextResponse.json({ service: data });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 소유권 확인
  const { data: existing, error: fetchError } = await supabase
    .from('services')
    .select('id, name, user_id, is_custom')
    .eq('id', id)
    .eq('is_custom', true)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !existing) return notFoundError('커스텀 서비스');

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'custom_service.delete',
    resourceType: 'service',
    resourceId: id,
    details: { name: existing.name },
  });

  return NextResponse.json({ success: true });
}
