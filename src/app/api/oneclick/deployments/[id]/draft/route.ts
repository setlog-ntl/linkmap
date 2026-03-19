import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { z } from 'zod';

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

const draftSchema = z.object({
  moduleDraft: z.object({
    state: z.record(z.string(), z.unknown()),
    savedAt: z.string(),
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
  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((e) => e.message).join(', ');
    return apiError(messages, 400);
  }

  // Verify ownership
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, config_data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!deploy) return notFoundError('배포');

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
