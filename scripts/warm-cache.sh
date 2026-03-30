#!/usr/bin/env bash
# warm-cache.sh — 배포 후 주요 공개 페이지 ISR 캐시 워밍업
# Usage: bash scripts/warm-cache.sh [BASE_URL]
# Example: bash scripts/warm-cache.sh https://linkmap.biz

set -euo pipefail

BASE_URL="${1:-https://linkmap.biz}"
FAILED=0
TOTAL=0

# 주요 공개 페이지 목록 (Workers CPU 초과 방지를 위해 순차 요청)
# QA 점검(2026-03-30) 기준 — 503 발생 경로 전수 추가
PAGES=(
  # ── 핵심 공개 ──
  "/"
  "/pricing"
  "/services"
  "/services/compare"
  "/services/cost-simulator"
  "/blog"
  "/showcase"
  "/about"
  "/changelog"

  # ── 인증 (force-dynamic → 정적화 전환 후에도 초기 1회 워밍 필요) ──
  "/login"
  "/signup"
  "/reset-password"

  # ── 법적 페이지 (항시 가용 필수) ──
  "/terms"
  "/privacy"

  # ── 콘텐츠 페이지 ──
  "/faq"
  "/glossary"
  "/feedback"
  "/oneclick"

  # ── 데모 ──
  "/demo"
  "/demo/project/demo-1"
  "/demo/project/demo-1/service-map"
  "/demo/project/demo-1/services"
  "/demo/project/demo-1/costs"
  "/demo/project/demo-1/env"
  "/demo/project/demo-1/connections"
  "/demo/project/demo-2"
  "/demo/project/demo-3"
  "/demo/project/demo-4"

  # ── 가이드 인덱스 ──
  "/guides"
  "/guides/ai-tools"
  "/guides/auth"
  "/guides/api-basics"
  "/guides/automation"
  "/guides/backend"
  "/guides/cloudflare"
  "/guides/communication"
  "/guides/deploy"
  "/guides/design-ui"
  "/guides/domain"
  "/guides/env"
  "/guides/frontend"
  "/guides/github"
  "/guides/monitoring"
  "/guides/openai"
  "/guides/package-manager"
  "/guides/payment"
  "/guides/security"
  "/guides/server"
  "/guides/supabase"
  "/guides/vercel"
  "/guides/version-control"

  # ── 가이드 상세 (503 빈발 경로 우선) ──
  "/guides/auth/google"
  "/guides/auth/kakao"
  "/guides/api-basics/api-auth"
  "/guides/api-basics/error-handling"
  "/guides/api-basics/fetch-axios"
  "/guides/automation/scheduling"
  "/guides/automation/sns-api"
  "/guides/automation/webhook"
  "/guides/backend/baas"
  "/guides/backend/database"
  "/guides/cloudflare/domain"
  "/guides/cloudflare/secrets"
  "/guides/cloudflare/workers"
  "/guides/communication/email"
  "/guides/communication/push"
  "/guides/communication/realtime"
  "/guides/deploy/cicd"
  "/guides/deploy/github-actions"
  "/guides/deploy/hosting"
  "/guides/deploy/vercel-deploy"
  "/guides/design-ui/components"
  "/guides/design-ui/responsive"
  "/guides/design-ui/tailwind"
  "/guides/domain/dns-records"
  "/guides/domain/how-to-buy"
  "/guides/env/deploy-vars"
  "/guides/env/dotenv-files"
  "/guides/frontend/react-nextjs"
  "/guides/frontend/rendering-modes"
  "/guides/github/first-repo"
  "/guides/github/git-setup"
  "/guides/monitoring/analytics"
  "/guides/monitoring/error-tracking"
  "/guides/monitoring/feature-flags"
  "/guides/openai/api-key"
  "/guides/openai/nextjs-integration"
  "/guides/package-manager/npm-basics"
  "/guides/package-manager/package-json"
  "/guides/package-manager/troubleshooting"
  "/guides/payment/stripe"
  "/guides/payment/toss"
  "/guides/payment/webhook"
  "/guides/security/https-cors"
  "/guides/security/secrets-management"
  "/guides/security/web-vulnerabilities"
  "/guides/server/cdn"
  "/guides/server/hosting-types"
  "/guides/supabase/auth-setup"
  "/guides/supabase/database-rls"
  "/guides/supabase/project-setup"
  "/guides/vercel/custom-domain"
  "/guides/vercel/github-deploy"
  "/guides/version-control/branching"
  "/guides/version-control/conflict"
  "/guides/version-control/pull-request"

  # ── 서비스 상세 (인기 서비스 — 캐시 유지) ──
  "/services/supabase"
  "/services/vercel"
  "/services/stripe"
  "/services/firebase"
  "/services/netlify"
)

echo "🔥 Cache warming: ${BASE_URL}"
echo "---"

for path in "${PAGES[@]}"; do
  TOTAL=$((TOTAL + 1))
  url="${BASE_URL}${path}"
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$url" 2>/dev/null || echo "000")

  if [ "$status" -ge 200 ] && [ "$status" -lt 400 ]; then
    echo "✅ ${status} ${path}"
  else
    echo "⚠️  ${status} ${path}"
    FAILED=$((FAILED + 1))
  fi

  sleep 1
done

echo "---"
echo "Result: ${TOTAL} pages, ${FAILED} failed"

if [ "$FAILED" -gt 0 ]; then
  echo "⚠️  Some pages failed to warm. Check logs above."
  exit 1
fi

echo "✅ All pages warmed successfully."
