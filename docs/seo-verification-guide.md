# SEO/GEO 검증 가이드

## 1. JSON-LD 구조화 데이터 검증

### 로컬 검증
```bash
npm run validate:jsonld
```

### Google Rich Results Test
1. https://search.google.com/test/rich-results 접속
2. URL 입력: `https://www.linkmap.biz` (또는 개별 페이지)
3. "URL 테스트" 클릭 → 구조화 데이터 감지 결과 확인

### Schema.org Validator
1. https://validator.schema.org/ 접속
2. "Fetch URL" 탭에서 페이지 URL 입력
3. 경고/오류 확인

## 2. RSS Feed 검증

### W3C Feed Validation Service
1. https://validator.w3.org/feed/ 접속
2. URL 입력: `https://www.linkmap.biz/feed.xml`
3. "Check" 클릭 → 오류/경고 확인

### 수동 확인
```bash
curl -s https://www.linkmap.biz/feed.xml | head -20
```

## 3. IndexNow 키 등록

### Bing Webmaster Tools
1. https://www.bing.com/webmasters 로그인
2. 사이트 추가: `www.linkmap.biz`
3. Settings → IndexNow → API Key 확인
4. `INDEXNOW_API_KEY` 환경변수 설정
5. `public/indexnow-key.txt` 파일 내용을 실제 키로 교체

### IndexNow 제출 테스트
```bash
# 관리자 인증 토큰 필요
curl -X POST https://www.linkmap.biz/api/indexnow \
  -H "Content-Type: application/json" \
  -H "Cookie: <auth-cookie>" \
  -d '{"urls": ["https://www.linkmap.biz/blog/latest-post"]}'
```

## 4. Canonical URL 확인

브라우저에서 페이지 소스 보기 (`Ctrl+U`) 후 검색:
```html
<link rel="canonical" href="https://www.linkmap.biz/pricing">
```

대상 페이지: `/pricing`, `/faq`, `/glossary`, `/services`, `/services/compare`, `/services/cost-simulator`, `/showcase`

## 5. RSS Feed Head 링크 확인

페이지 소스에서 확인:
```html
<link rel="alternate" type="application/rss+xml" href="/feed.xml">
```
