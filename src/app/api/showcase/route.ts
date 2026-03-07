import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // 1. 배포 기반 쇼케이스
  const { data: deployShowcases } = await supabase
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
    .eq('is_showcase', true)
    .eq('deploy_status', 'ready')
    .order('deployed_at', { ascending: false })
    .limit(50);

  // 2. 프로젝트 기반 쇼케이스
  const { data: projectShowcases } = await supabase
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
    .eq('is_showcase', true)
    .order('created_at', { ascending: false })
    .limit(50);

  // 통합 결과: 배포 기반 + 프로젝트 기반을 source 필드로 구분
  const combined = [
    ...(deployShowcases || []).map((d) => ({
      ...d,
      source: 'deploy' as const,
    })),
    ...(projectShowcases || []).map((p) => ({
      id: p.id,
      site_name: p.name,
      pages_url: p.link_url,
      deployment_url: null,
      deploy_method: null,
      deployed_at: null,
      created_at: p.created_at,
      user_id: p.user_id,
      showcase_description: p.showcase_description || p.description,
      showcase_tags: p.showcase_tags,
      showcase_category: p.showcase_category,
      homepage_templates: null,
      profiles: p.profiles,
      project_icon_type: p.icon_type,
      project_icon_value: p.icon_value,
      source: 'project' as const,
    })),
  ];

  // 최신순 정렬
  combined.sort((a, b) => {
    const dateA = a.deployed_at || a.created_at;
    const dateB = b.deployed_at || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return NextResponse.json({ showcases: combined.slice(0, 50) });
}
