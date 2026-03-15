import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'Linkmap Showcase';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.linkmap.biz';

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)' } }
    ).then((r) => r.text());
    const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:woff|ttf))\)/);
    if (!urlMatch) return null;
    return fetch(urlMatch[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function loadImage(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${SITE_URL}${path}`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return `data:image/png;base64,${Buffer.from(buf).toString('base64')}`;
  } catch {
    return null;
  }
}

interface ShowcaseData {
  site_name: string;
  showcase_description: string | null;
  showcase_category: string | null;
  showcase_tags: string[];
  like_count: number;
  comment_count: number;
  pages_url: string | null;
  deployment_url: string | null;
  author_name: string | null;
  template_name: string | null;
}

async function getShowcase(id: string): Promise<ShowcaseData | null> {
  const supabase = await createClient();

  const { data: deploy } = await supabase
    .from('homepage_deploys')
    .select(`
      site_name, showcase_description, showcase_category, showcase_tags,
      like_count, comment_count, pages_url, deployment_url,
      homepage_templates ( name_ko ),
      profiles:user_id ( name )
    `)
    .eq('id', id).eq('is_showcase', true).eq('deploy_status', 'ready')
    .maybeSingle();

  if (deploy) {
    const prof = Array.isArray(deploy.profiles) ? deploy.profiles[0] : deploy.profiles;
    const tmpl = Array.isArray(deploy.homepage_templates) ? deploy.homepage_templates[0] : deploy.homepage_templates;
    return {
      site_name: deploy.site_name,
      showcase_description: deploy.showcase_description,
      showcase_category: deploy.showcase_category,
      showcase_tags: deploy.showcase_tags || [],
      like_count: deploy.like_count ?? 0,
      comment_count: deploy.comment_count ?? 0,
      pages_url: deploy.pages_url,
      deployment_url: deploy.deployment_url,
      author_name: prof?.name ?? null,
      template_name: tmpl?.name_ko ?? null,
    };
  }

  const { data: project } = await supabase
    .from('projects')
    .select(`
      name, link_url, description, showcase_description, showcase_category,
      showcase_tags, like_count, comment_count,
      profiles:user_id ( name )
    `)
    .eq('id', id).eq('is_showcase', true)
    .maybeSingle();

  if (project) {
    const prof = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
    return {
      site_name: project.name,
      showcase_description: project.showcase_description || project.description,
      showcase_category: project.showcase_category,
      showcase_tags: project.showcase_tags || [],
      like_count: project.like_count ?? 0,
      comment_count: project.comment_count ?? 0,
      pages_url: project.link_url,
      deployment_url: null,
      author_name: prof?.name ?? null,
      template_name: null,
    };
  }

  return null;
}

const CATEGORY_LABELS: Record<string, string> = {
  portfolio: '포트폴리오', business: '비즈니스', blog: '블로그',
  landing: '랜딩페이지', community: '커뮤니티', ecommerce: '이커머스', other: '기타',
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [fontData, iconSrc, showcase] = await Promise.all([
    loadKoreanFont(),
    loadImage('/og-icon.png'),
    getShowcase(id),
  ]);

  const fontFamily = fontData ? 'Noto Sans KR' : 'sans-serif';

  if (!showcase) {
    return new ImageResponse(
      (
        <div style={{ background: '#0a0e1a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily }}>
          <div style={{ color: '#94a3b8', fontSize: '32px' }}>쇼케이스를 찾을 수 없습니다</div>
        </div>
      ),
      { ...size }
    );
  }

  const liveUrl = showcase.pages_url || showcase.deployment_url || '';
  const displayUrl = liveUrl.replace('https://', '').replace('http://', '').replace(/\/$/, '');
  const categoryLabel = showcase.showcase_category ? CATEGORY_LABELS[showcase.showcase_category] : null;
  const tags = showcase.showcase_tags.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0e1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 글로우 */}
        <div style={{ position: 'absolute', top: '-120px', right: '-60px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(51,65,85,0.2) 0.5px, transparent 0.5px)', backgroundSize: '36px 36px' }} />

        {/* 상단 헤더 — 로고 + SHOWCASE + 카테고리 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 56px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* 앱 아이콘 */}
            {iconSrc ? (
              <img src={iconSrc} width={44} height={44} style={{ borderRadius: '11px' }} />
            ) : (
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />
              </div>
            )}
            <span style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 700, letterSpacing: '0.02em' }}>Linkmap</span>
            <div style={{ width: '1px', height: '18px', background: '#334155', margin: '0 2px' }} />
            <span style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Showcase</span>
          </div>

          {categoryLabel && (
            <div style={{ padding: '5px 14px', background: 'rgba(59,130,246,0.1)', borderRadius: '16px', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '15px', fontWeight: 700 }}>
              {categoryLabel}
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px', gap: '18px' }}>
          {/* 사이트 이름 */}
          <div style={{ color: '#f1f5f9', fontSize: showcase.site_name.length > 20 ? '50px' : '60px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: '900px' }}>
            {showcase.site_name.length > 32 ? showcase.site_name.slice(0, 32) + '...' : showcase.site_name}
          </div>

          {/* 설명 */}
          {showcase.showcase_description && (
            <div style={{ color: '#94a3b8', fontSize: '21px', lineHeight: 1.5, maxWidth: '780px' }}>
              {showcase.showcase_description.length > 80 ? showcase.showcase_description.slice(0, 80) + '...' : showcase.showcase_description}
            </div>
          )}

          {/* 태그 */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
              {tags.map((tag) => (
                <div key={tag} style={{ padding: '4px 12px', background: 'rgba(148,163,184,0.08)', borderRadius: '12px', border: '1px solid rgba(148,163,184,0.12)', color: '#94a3b8', fontSize: '14px' }}>
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 바 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 56px 34px' }}>
          {/* URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {displayUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', background: 'rgba(30,41,59,0.7)', borderRadius: '8px', border: '1px solid rgba(51,65,85,0.4)' }}>
                <div style={{ width: '7px', height: '7px', background: '#10b981', borderRadius: '50%' }} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                  {displayUrl.length > 32 ? displayUrl.slice(0, 32) + '...' : displayUrl}
                </span>
              </div>
            )}
          </div>

          {/* 통계 + 작성자 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '15px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f87171" stroke="#f87171" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{showcase.like_count}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '15px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{showcase.comment_count}</span>
            </div>
            {showcase.author_name && (
              <>
                <div style={{ width: '1px', height: '18px', background: '#334155' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                    {showcase.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500 }}>{showcase.author_name}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 하단 악센트 라인 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)' }} />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, style: 'normal' as const, weight: 800 as const }]
        : [],
    }
  );
}
