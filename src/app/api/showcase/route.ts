import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // 1. 배포 기반 쇼케이스
  const { data: deployShowcases, error: deployError } = await supabase
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
      showcase_image_url,
      like_count,
      comment_count,
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
  const { data: projectShowcases, error: projectError } = await supabase
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
      showcase_image_url,
      like_count,
      comment_count,
      created_at,
      user_id,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('is_showcase', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  // profiles join 실패 시 profiles 없이 재시도
  let projectData = projectShowcases;
  if (projectError && !projectShowcases) {
    console.error('[Showcase API] project query error (retrying without profiles):', projectError.message);
    const { data: fallback } = await supabase
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
        showcase_image_url,
        like_count,
        comment_count,
        created_at,
        user_id
      `)
      .eq('is_showcase', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);
    projectData = fallback?.map((p) => ({ ...p, profiles: null as unknown as { name: string; avatar_url: string }[] })) ?? null;
  }

  if (deployError) {
    console.error('[Showcase API] deploy error:', deployError.message);
  }

  // 통합 결과: 배포 기반 + 프로젝트 기반을 source 필드로 구분
  const combined = [
    ...(deployShowcases || []).map((d) => {
      const dProf = Array.isArray(d.profiles) ? d.profiles[0] ?? null : d.profiles ?? null;
      return {
        ...d,
        profiles: dProf as { name: string | null; avatar_url: string | null } | null,
        source: 'deploy' as const,
      };
    }),
    ...(projectData || []).map((p) => {
      // PostgREST가 profiles를 배열로 반환할 수 있음 (FK가 auth.users 경유)
      const prof = Array.isArray(p.profiles) ? p.profiles[0] ?? null : p.profiles ?? null;
      return {
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
        showcase_image_url: p.showcase_image_url,
        like_count: p.like_count ?? 0,
        comment_count: p.comment_count ?? 0,
        homepage_templates: null,
        profiles: prof as { name: string | null; avatar_url: string | null } | null,
        project_icon_type: p.icon_type,
        project_icon_value: p.icon_value,
        source: 'project' as const,
      };
    }),
  ];

  // 최신순 정렬
  combined.sort((a, b) => {
    const dateA = a.deployed_at || a.created_at;
    const dateB = b.deployed_at || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return NextResponse.json({ showcases: combined.slice(0, 50) });
}
