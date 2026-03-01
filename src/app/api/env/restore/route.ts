import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import type { DbEnvVarWithProject } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });

  const { data: envVar } = await supabase
    .from('environment_variables')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .not('deleted_at', 'is', null)
    .single();

  const typed = envVar as DbEnvVarWithProject | null;
  if (!typed || typed.project.user_id !== user.id) return notFoundError('환경변수');

  const { error } = await supabase
    .from('environment_variables')
    .update({ deleted_at: null })
    .eq('id', id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'env_var.restore',
    resourceType: 'environment_variable',
    resourceId: id,
    details: { key_name: typed.key_name },
  });

  return NextResponse.json({ success: true });
}
