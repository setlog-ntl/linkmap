import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 배포 기반 쇼케이스 시도
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select(`
      id,
      site_name,
      pages_url,
      deployment_url,
      deploy_method,
      deployed_at,
      created_at,
      user_id,
      showcase_description,
      showcase_tags,
      showcase_category,
      homepage_templates (
        id,
        slug,
        name,
        name_ko,
        framework,
        preview_image_url
      ),
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('id', id)
    .eq('is_showcase', true)
    .eq('deploy_status', 'ready')
    .maybeSingle();

  if (deploy) {
    return NextResponse.json({ showcase: { ...deploy, source: 'deploy' } });
  }

  // 2. 프로젝트 기반 쇼케이스 시도
  const { data: project } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      link_url,
      description,
      icon_type,
      icon_value,
      showcase_description,
      showcase_tags,
      showcase_category,
      created_at,
      user_id,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('id', id)
    .eq('is_showcase', true)
    .maybeSingle();

  if (project) {
    return NextResponse.json({
      showcase: {
        id: project.id,
        site_name: project.name,
        pages_url: project.link_url,
        deployment_url: null,
        deploy_method: null,
        deployed_at: null,
        created_at: project.created_at,
        user_id: project.user_id,
        showcase_description: project.showcase_description || project.description,
        showcase_tags: project.showcase_tags,
        showcase_category: project.showcase_category,
        homepage_templates: null,
        profiles: project.profiles,
        project_icon_type: project.icon_type,
        project_icon_value: project.icon_value,
        source: 'project',
      },
    });
  }

  return NextResponse.json({ error: '쇼케이스를 찾을 수 없습니다' }, { status: 404 });
}
