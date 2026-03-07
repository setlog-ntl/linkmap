import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError } from '@/lib/api/errors';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 소유권 확인
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('id, user_id, is_showcase, deploy_status')
    .eq('id', id)
    .single();

  if (!deploy) return notFoundError('배포');
  if (deploy.user_id !== user.id) return unauthorizedError();

  // ready 상태만 쇼케이스 가능
  if (deploy.deploy_status !== 'ready') {
    return NextResponse.json(
      { error: '배포 완료된 사이트만 쇼케이스에 등록할 수 있습니다' },
      { status: 400 }
    );
  }

  const newValue = !deploy.is_showcase;

  const { error } = await supabase
    .from('homepage_deploys')
    .update({ is_showcase: newValue })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ is_showcase: newValue });
}
