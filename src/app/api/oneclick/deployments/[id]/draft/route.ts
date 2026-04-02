import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { z } from 'zod';
import { getModuleSchema } from '@/data/oneclick/module-schemas';

const MAX_DRAFT_BODY_SIZE = 102_400; // 100 KB

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, config_data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  const configData = (deploy.config_data as Record<string, unknown>) || {};
  return NextResponse.json({ moduleDraft: configData.moduleDraft ?? null });
}

const moduleStateSchema = z.object({
  values: z
    .record(
      z.string().max(50),
      z.record(z.string().max(50), z.unknown()),
    )
    .refine((obj) => Object.keys(obj).length <= 20, '모듈 수 초과'),
  enabled: z.array(z.string().max(50)).max(20),
  order: z.array(z.string().max(50)).max(20),
});

const draftSchema = z.object({
  moduleDraft: z.object({
    state: moduleStateSchema,
    savedAt: z.string().datetime({ message: 'ISO 8601 형식이어야 합니다' }),
  }),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();

  // 전체 body 크기 제한 (DB 부하 방지)
  if (JSON.stringify(body).length > MAX_DRAFT_BODY_SIZE) {
    return apiError('요청 크기가 100KB를 초과합니다', 400);
  }

  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(', ');
    return apiError(messages, 400);
  }

  // Verify ownership + get template slug for module ID whitelist
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, config_data, homepage_templates ( slug )')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  // 모듈 ID 화이트리스트 검증
  const templateSlug = (deploy.homepage_templates as unknown as Record<string, unknown>)?.slug as string | undefined;
  if (templateSlug) {
    const schema = getModuleSchema(templateSlug);
    if (schema) {
      const validIds = new Set(schema.modules.map((m) => m.id));
      const { values, enabled, order } = parsed.data.moduleDraft.state;
      const allIds = [...Object.keys(values), ...enabled, ...order];
      const invalidId = allIds.find((id) => !validIds.has(id));
      if (invalidId) {
        return apiError(`유효하지 않은 모듈 ID: ${invalidId}`, 400);
      }
    }
  }

  const existingConfig = (deploy.config_data as Record<string, unknown>) || {};
  const updatedConfig = { ...existingConfig, moduleDraft: parsed.data.moduleDraft };

  const { error } = await supabase
    .from('homepage_deploys')
    .update({ config_data: updatedConfig })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, config_data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

  const existingConfig = (deploy.config_data as Record<string, unknown>) || {};
  const { moduleDraft: _, ...rest } = existingConfig;

  const { error } = await supabase
    .from('homepage_deploys')
    .update({ config_data: Object.keys(rest).length > 0 ? rest : {} })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
