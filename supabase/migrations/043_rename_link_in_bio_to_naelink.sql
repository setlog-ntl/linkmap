-- 043: link-in-bio-pro 템플릿 명칭 변경 — '링크인바이오 프로' → '내링크모음'
--      영문 name도 'Link-in-Bio Pro' → 'My Link Page'로 통일 (homepage-templates.ts 기준)

UPDATE homepage_templates
SET
  name       = 'My Link Page',
  name_ko    = '내링크모음',
  description_ko = 'SNS 프로필에 연결하는 나만의 링크 페이지. 애니메이션 배경, 커스텀 테마, 방문자 통계까지.'
WHERE slug = 'link-in-bio-pro';
