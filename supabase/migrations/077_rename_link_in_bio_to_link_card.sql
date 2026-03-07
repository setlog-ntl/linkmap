-- Migration 077: Rename link-in-bio-pro → link-card
-- 템플릿 슬러그 변경 — 경쟁사 연상 용어 제거

-- 1. homepage_templates 테이블 slug 업데이트
UPDATE homepage_templates
SET slug = 'link-card'
WHERE slug = 'link-in-bio-pro';

-- 2. homepage_deploys 테이블 (template_id FK 참조이므로 slug 직접 저장 없으면 불필요)
-- template_id UUID FK → homepage_templates(id) 이므로 자동 반영

-- 3. deploy_error_logs 테이블 template_slug 컬럼
UPDATE deploy_error_logs
SET template_slug = 'link-card'
WHERE template_slug = 'link-in-bio-pro';

-- 4. oneclick_deployments에 template_slug 텍스트 컬럼이 있다면
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'oneclick_deployments' AND column_name = 'template_slug'
  ) THEN
    EXECUTE $sql$
      UPDATE oneclick_deployments
      SET template_slug = 'link-card'
      WHERE template_slug = 'link-in-bio-pro'
    $sql$;
  END IF;
END $$;
