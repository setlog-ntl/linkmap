import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';

const CONNECTION_ACTIONS = [
  'connection.create',
  'connection.auto_create',
  'connection.update',
  'connection.verify',
  'connection.restore',
  'connection.delete',
  'connection.permanently_delete',
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { id } = await params;

  // 소유권 확인
  const { data: connection } = await supabase
    .from('user_connections')
    .select('id, project:projects!inner(user_id)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!connection || (connection.project as unknown as { user_id: string }).user_id !== user.id) {
    return apiError('연결을 찾을 수 없습니다', 404);
  }

  // audit_logs에서 이 연결에 대한 이력 조회 (RLS: 본인 로그만 조회)
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('id, action, details, created_at')
    .eq('resource_id', id)
    .in('action', CONNECTION_ACTIONS)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return apiError(error.message, 400);

  return NextResponse.json(logs ?? []);
}
