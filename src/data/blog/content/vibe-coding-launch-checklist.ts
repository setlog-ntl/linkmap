export const content = `> **KEY:** 바이브코딩으로 앱을 만드는 것보다 실제 사용자에게 공개하는 순간이 더 중요합니다. API 키 노출, 인증 누락, 비용 폭탄은 코드 한 줄로 시작되며, 런칭 전 체계적인 점검이 반드시 필요합니다.

## 보안 점검

- [x] \`.env\` 파일이 \`.gitignore\`에 포함
- [x] \`NEXT_PUBLIC_\` 접두사에 시크릿 없음
- [ ] 커밋 히스토리에 API 키 없음
- [ ] 인증 로직 반전 없음 (\`if (!user) return error\` 패턴 확인)
- [ ] Supabase 사용 시 RLS 활성화
- [ ] 프론트엔드 번들에서 시크릿 미노출

> **WARNING:** AI가 생성한 코드에 \`console.log(process.env.API_KEY)\` 같은 디버깅 코드가 남아있을 수 있습니다. 배포 전 반드시 전체 검색하여 제거하세요.

[바이브코딩 보안 체크리스트](/blog/vibe-coding-security-checklist)에서 더 상세한 보안 점검 항목을 확인할 수 있습니다.

## 성능 점검

[Lighthouse](https://web.dev/measure)로 성능 점수를 측정하세요.

| 항목 | 최소 기준 | 권장 |
|------|----------|------|
| Performance | 70점 | 90점+ |
| Accessibility | 80점 | 95점+ |
| SEO | 80점 | 95점+ |

- [ ] LCP(Largest Contentful Paint) 2.5초 이하
- [ ] Next.js 사용 시 \`next/image\` 컴포넌트 적용
- [ ] 불필요한 JavaScript 번들 없음

---

## SEO 기본 설정

- [ ] 각 페이지에 고유한 \`title\` 태그 (50-60자)
- [ ] \`meta description\` 태그 (150-160자)
- [ ] OG 태그 설정 (SNS 공유 미리보기)
- [ ] \`/sitemap.xml\` 생성
- [ ] Google Search Console에 sitemap 제출

> **INFO:** Next.js App Router에서는 \`app/sitemap.ts\`로 동적 sitemap을 생성할 수 있습니다. 페이지가 많을수록 검색 노출에 영향이 큽니다.

## 에러 모니터링

[Sentry](https://sentry.io) 무료 플랜으로 월 5,000건의 에러를 추적할 수 있습니다.

- [ ] 에러 모니터링 도구 설정 완료
- [ ] 프로덕션 에러 알림 설정 (이메일/슬랙)
- [ ] \`catch\` 블록에서 에러를 무시하지 않고 리포팅

## 백업 전략

- [ ] Supabase Pro 플랜이면 일별 자동 백업 확인
- [ ] Free 플랜이면 수동 백업 스크립트 준비
- [ ] 모든 코드가 Git 저장소에 관리됨

> **TIP:** [Linkmap](https://www.linkmap.biz)을 사용하면 환경변수를 AES-256-GCM으로 암호화 보관하고, GitHub Secrets와 자동 동기화할 수 있습니다.

## 비용 예측

| 서비스 | 무료 한도 |
|--------|----------|
| Vercel | 100GB 대역폭/월 |
| Supabase | DB 500MB, 50K MAU |
| Cloudflare | 무제한 대역폭, 10만 요청/일 |
| OpenAI | 선불 크레딧 소진 시 중단 |

- [ ] 종량제 API에 월별 지출 한도 설정
- [ ] 비용 알림(Cost Alert) 설정
- [ ] 무료 플랜이 예상 트래픽에 충분한지 확인

[Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 128개 서비스의 연결 현황을 시각적으로 파악할 수 있습니다.

> **TRY:** 체크리스트를 통과했다면 [Linkmap 무료로 시작](https://www.linkmap.biz/signup)하여 서비스맵을 만들고 외부 서비스 전체를 한눈에 파악해보세요.

---

*배포 환경 설정은 [배포 완전 정복 가이드](/guides/deploy)를, .env 보안은 [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)를 참고하세요.*`;
