import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: connection } = await supabase
    .from('user_connections')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .not('deleted_at', 'is', null)
    .single();

  if (!connection || (connection.project as { user_id: string }).user_id !== user.id) {
    return apiError('연결을 찾을 수 없습니다', 404);
  }

  const { error } = await supabase
    .from('user_connections')
    .update({ deleted_at: null })
    .eq('id', id);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'connection.restore',
    resourceType: 'user_connection',
    resourceId: id,
    details: { project_id: connection.project_id },
  });

  return NextResponse.json({ success: true });
}
