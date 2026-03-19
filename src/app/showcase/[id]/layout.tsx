import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 3600; // ISR: 1시간 캐시

const CATEGORY_LABELS: Record<string, string> = {
  portfolio: '포트폴리오',
  business: '비즈니스',
  blog: '블로그',
  landing: '랜딩페이지',
  community: '커뮤니티',
  ecommerce: '이커머스',
  other: '기타',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  // 배포 기반 쇼케이스
  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select('site_name, showcase_description, showcase_category')
    .eq('id', id)
    .eq('is_showcase', true)
    .eq('deploy_status', 'ready')
    .maybeSingle();

  if (deploy) {
    const category = deploy.showcase_category ? CATEGORY_LABELS[deploy.showcase_category] : null;
    const title = `${deploy.site_name} — Linkmap Showcase`;
    const description = deploy.showcase_description
      || `${deploy.site_name}${category ? ` (${category})` : ''} — Linkmap에서 만든 사이트를 확인하세요`;

    return {
      title,
      description,
      openGraph: { title, description, type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  // 프로젝트 기반 쇼케이스
  const { data: project } = await supabase
    .from('projects')
    .select('name, showcase_description, showcase_category, description')
    .eq('id', id)
    .eq('is_showcase', true)
    .maybeSingle();

  if (project) {
    const category = project.showcase_category ? CATEGORY_LABELS[project.showcase_category] : null;
    const title = `${project.name} — Linkmap Showcase`;
    const description = project.showcase_description || project.description
      || `${project.name}${category ? ` (${category})` : ''} — Linkmap에서 만든 프로젝트를 확인하세요`;

    return {
      title,
      description,
      openGraph: { title, description, type: 'website' },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  return {
    title: '쇼케이스를 찾을 수 없습니다 | Linkmap',
  };
}

export default function ShowcaseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
