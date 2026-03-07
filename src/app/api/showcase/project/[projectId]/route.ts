import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 프로젝트에 연결된 ready 배포 중 가장 최근 것 조회
  const { data } = await supabase
    .from('homepage_deploys')
    .select(`
      id,
      site_name,
      deploy_status,
      is_showcase,
      showcase_description,
      showcase_tags,
      showcase_category,
      pages_url,
      deployment_url
    `)
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .eq('deploy_status', 'ready')
    .order('deployed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ deploy: data });
}
