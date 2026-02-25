-- Migration 047: dx_score → github_stars
-- dx_score(0~10 주관적 수치)를 GitHub Stars(정수, nullable)로 대체

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS github_stars INTEGER;

-- 알려진 서비스들의 github_stars 초기값 설정 (approximate, 2026년 기준)
UPDATE public.services SET github_stars = CASE slug
  WHEN 'supabase'       THEN 82000
  WHEN 'firebase'       THEN 5000
  WHEN 'vercel'         THEN 13000
  WHEN 'netlify'        THEN 18000
  WHEN 'stripe'         THEN 9000
  WHEN 'clerk'          THEN 2500
  WHEN 'nextauth'       THEN 25000
  WHEN 'resend'         THEN 2500
  WHEN 'sendgrid'       THEN 2500
  WHEN 'openai'         THEN 25000
  WHEN 'anthropic'      THEN 2000
  WHEN 'cloudinary'     THEN 1500
  WHEN 'sentry'         THEN 40000
  WHEN 'planetscale'    THEN 1500
  WHEN 'neon'           THEN 15000
  WHEN 'railway'        THEN 3500
  WHEN 'lemon-squeezy'  THEN 500
  WHEN 'uploadthing'    THEN 4500
  WHEN 'posthog'        THEN 23000
  WHEN 'aws-s3'         THEN 30000
  WHEN 'github'         THEN 16000
  WHEN 'claude-code'    THEN 15000
  WHEN 'google-gemini'  THEN 1500
  WHEN 'auth0'          THEN 4500
  WHEN 'convex'         THEN 4000
  WHEN 'drizzle'        THEN 26000
  WHEN 'prisma'         THEN 40000
  WHEN 'turso'          THEN 3000
  WHEN 'pinecone'       THEN 1000
  WHEN 'langchain'      THEN 14000
  WHEN 'replicate'      THEN 2000
  WHEN 'huggingface'    THEN 12000
  WHEN 'stability-ai'   THEN 2500
  WHEN 'notion-api'     THEN 5000
  WHEN 'linear-api'     THEN 4000
  WHEN 'paypal'         THEN 2000
  WHEN 'r2'             THEN 3500
  WHEN 'grafana'        THEN 64000
  WHEN 'new-relic'      THEN 1500
  WHEN 'vitest'         THEN 14000
  WHEN 'storybook'      THEN 85000
  WHEN 'docker'         THEN 69000
  -- services-v2
  WHEN 'github-actions' THEN 5000
  WHEN 'twilio'         THEN 3500
  WHEN 'algolia'        THEN 4500
  WHEN 'sanity'         THEN 5000
  WHEN 'upstash-redis'  THEN 3500
  WHEN 'cloudflare'     THEN 3500
  WHEN 'flyio'          THEN 3500
  WHEN 'datadog'        THEN 2000
  WHEN 'meilisearch'    THEN 50000
  WHEN 'pusher'         THEN 5500
  WHEN 'trigger-dev'    THEN 9000
  WHEN 'playwright'     THEN 70000
  WHEN 'slack-api'      THEN 3500
  WHEN 'mapbox'         THEN 11000
  WHEN 'inngest'        THEN 4000
  WHEN 'strapi'         THEN 65000
  WHEN 'plausible'      THEN 22000
  WHEN 'cypress'        THEN 47000
  WHEN 'bullmq'         THEN 6000
  ELSE NULL
END;

ALTER TABLE public.services DROP COLUMN IF EXISTS dx_score;
