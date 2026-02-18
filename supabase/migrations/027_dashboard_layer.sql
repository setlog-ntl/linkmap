-- 027: Dashboard Layer columns for 3-Column Architecture Dashboard
-- Adds dashboard_layer and dashboard_subcategory to services table

ALTER TABLE services ADD COLUMN IF NOT EXISTS dashboard_layer TEXT DEFAULT 'backend';
ALTER TABLE services ADD COLUMN IF NOT EXISTS dashboard_subcategory TEXT;

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_services_dashboard_layer ON services (dashboard_layer);
CREATE INDEX IF NOT EXISTS idx_services_dashboard_subcategory ON services (dashboard_subcategory);

-- Update existing services with layer and subcategory mapping
-- Frontend layer: deploy, analytics, auth, social_login
UPDATE services SET dashboard_layer = 'frontend', dashboard_subcategory = 'deploy' WHERE slug IN ('vercel', 'netlify');
UPDATE services SET dashboard_layer = 'frontend', dashboard_subcategory = 'analytics' WHERE slug IN ('posthog');
UPDATE services SET dashboard_layer = 'frontend', dashboard_subcategory = 'auth' WHERE slug IN ('clerk', 'nextauth');
UPDATE services SET dashboard_layer = 'frontend', dashboard_subcategory = 'social_login' WHERE slug IN ('kakao-login', 'google-oauth', 'naver-login', 'apple-login', 'github-oauth');

-- Backend layer: database, payment, email, storage, hosting
UPDATE services SET dashboard_layer = 'backend', dashboard_subcategory = 'database' WHERE slug IN ('supabase', 'firebase', 'planetscale', 'neon');
UPDATE services SET dashboard_layer = 'backend', dashboard_subcategory = 'payment' WHERE slug IN ('stripe', 'lemon-squeezy');
UPDATE services SET dashboard_layer = 'backend', dashboard_subcategory = 'email' WHERE slug IN ('resend', 'sendgrid');
UPDATE services SET dashboard_layer = 'backend', dashboard_subcategory = 'storage' WHERE slug IN ('cloudinary', 'uploadthing', 'aws-s3');
UPDATE services SET dashboard_layer = 'backend', dashboard_subcategory = 'hosting' WHERE slug IN ('railway');

-- Devtools layer: ai, cicd, monitoring
UPDATE services SET dashboard_layer = 'devtools', dashboard_subcategory = 'ai' WHERE slug IN ('openai', 'anthropic', 'claude-code', 'google-gemini');
UPDATE services SET dashboard_layer = 'devtools', dashboard_subcategory = 'cicd' WHERE slug IN ('github');
UPDATE services SET dashboard_layer = 'devtools', dashboard_subcategory = 'monitoring' WHERE slug IN ('sentry');
