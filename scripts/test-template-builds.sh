#!/usr/bin/env bash
# 원클릭 템플릿 빌드 범용성 테스트
# 각 템플릿 번들을 디스크에 풀어 GitHub Actions와 동일하게 npm ci && next build 실행.
# 배포되는 정적 사이트가 모든 템플릿에서 실제로 빌드되는지(범용성)를 확정한다.
set -u

SLUGS="link-card digital-namecard personal-brand dev-showcase freelancer-page small-biz small-biz-cafe invitation"
ROOT="$(pwd)"
RESULTS="$ROOT/template-build-results.txt"
: > "$RESULTS"

pass=0
fail=0

for slug in $SLUGS; do
  dir="$(mktemp -d "${TMPDIR:-/tmp}/tplbuild-${slug}-XXXXXX")"
  echo "======================================================"
  echo "[$slug] materialize → $dir"
  if ! npx tsx "$ROOT/scripts/materialize-template.ts" "$slug" "$dir" 2>&1; then
    echo "[$slug] FAIL (materialize)" | tee -a "$RESULTS"
    fail=$((fail+1)); rm -rf "$dir"; continue
  fi

  echo "[$slug] npm ci ..."
  if ! ( cd "$dir" && npm ci --no-audit --no-fund > npm-ci.log 2>&1 ); then
    echo "[$slug] FAIL (npm ci)" | tee -a "$RESULTS"
    tail -20 "$dir/npm-ci.log"
    fail=$((fail+1)); rm -rf "$dir"; continue
  fi

  echo "[$slug] next build ..."
  if ! ( cd "$dir" && NEXT_PUBLIC_REPO_NAME="$slug" NEXT_PUBLIC_BASE_URL="https://example.github.io/$slug" npm run build > build.log 2>&1 ); then
    echo "[$slug] FAIL (build)" | tee -a "$RESULTS"
    tail -40 "$dir/build.log"
    fail=$((fail+1)); rm -rf "$dir"; continue
  fi

  if [ -f "$dir/out/index.html" ]; then
    files=$(find "$dir/out" -name '*.html' | wc -l | tr -d ' ')
    echo "[$slug] PASS (out/index.html + ${files} html files)" | tee -a "$RESULTS"
    pass=$((pass+1))
  else
    echo "[$slug] FAIL (no out/index.html)" | tee -a "$RESULTS"
    ls -la "$dir/out" 2>&1 | head -20
    fail=$((fail+1))
  fi
  rm -rf "$dir"
done

echo "======================================================"
echo "RESULT: $pass passed, $fail failed" | tee -a "$RESULTS"
[ "$fail" -eq 0 ]
