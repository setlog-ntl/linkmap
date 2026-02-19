-- Deactivate legacy static HTML templates that no longer have code bundles.
-- Idempotent: no-op if migration 023 already deactivated them.
UPDATE homepage_templates
SET is_active = false
WHERE slug IN ('portfolio-static', 'landing-static', 'resume-static',
               'blog-static', 'docs-static')
  AND is_active = true;
