-- 092: link-card 템플릿 name_ko 통일 — '내링크모음' → '링크카드'
-- homepage-templates.ts 시드와 동기화

UPDATE homepage_templates
SET
  name    = 'Link Card',
  name_ko = '링크카드'
WHERE slug = 'link-card';
