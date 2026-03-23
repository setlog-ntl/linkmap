#!/usr/bin/env bash
# warm-cache.sh — 배포 후 주요 공개 페이지 ISR 캐시 워밍업
# Usage: bash scripts/warm-cache.sh [BASE_URL]
# Example: bash scripts/warm-cache.sh https://linkmap.biz

set -euo pipefail

BASE_URL="${1:-https://linkmap.biz}"
FAILED=0
TOTAL=0

# 주요 공개 페이지 목록 (Workers CPU 초과 방지를 위해 순차 요청)
PAGES=(
  "/"
  "/services"
  "/services/compare"
  "/services/cost-simulator"
  "/blog"
  "/demo"
  "/showcase"
  "/pricing"
  "/about"
  "/login"
  "/changelog"
  "/privacy"
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
