export const content = `> **KEY:** Next.js \`<Link>\` 컴포넌트는 뷰포트에 보이는 모든 링크를 자동으로 prefetch합니다. Header와 Footer에 링크가 56개 이상 있으면 매 페이지 방문마다 RSC 요청이 40건 이상 동시에 발사됩니다. Cloudflare Workers Free Plan의 CPU 10ms 제한 환경에서는 이것이 503을 유발합니다.

## 코드를 안 바꿨는데 503이 났다

[Linkmap](https://www.linkmap.biz)을 Cloudflare Workers에 배포한 직후였습니다. 초기엔 잘 됐습니다. 그런데 며칠 지나지 않아 사용자 리포트가 들어오기 시작했습니다.

"가끔 페이지가 503으로 뜬다."

재현을 시도하면 잘 됩니다. 잠깐 기다렸다 접속하면 또 됩니다. 코드를 바꾸지 않았는데, 갑자기 됐다 안 됐다 반복합니다. 개발자라면 익숙한 그 고통스러운 패턴이었습니다.

처음엔 배포 환경 문제라고 생각했습니다. Cloudflare Workers가 낯선 플랫폼이었으니까요. [Cloudflare Workers](https://workers.cloudflare.com)는 전통적인 Node.js 서버가 아니라 V8 격리 환경에서 실행됩니다. 요청마다 새 인스턴스가 생기고, CPU 시간이 **10ms**로 제한됩니다.

> **INFO:** Cloudflare Workers Free Plan의 주요 제한: CPU 시간 10ms/요청, 일일 요청 10만 건. CPU 시간은 실제 코드 실행 시간만 측정하며 외부 \`fetch()\` 대기 시간은 포함되지 않습니다. 503은 "Worker exceeded resource limits" 오류로, 이 CPU 한계를 초과하거나 동시 처리가 과부하될 때 발생합니다.

## Phase 1~4: 옳은 방향, 하지만 완전하지 않았다

### 첫 번째 가설: 서버 사이드 렌더링 비용

Linkmap은 Next.js 16 App Router를 사용합니다. 배포 직후엔 페이지 요청이 들어올 때마다 서버에서 HTML을 생성하는 SSR 방식으로 동작했습니다. Workers 환경에서 SSR은 CPU 시간을 소모합니다.

**Phase 1**: 가이드 80개와 공개 페이지를 전부 정적화했습니다. \`export const revalidate = false\` 한 줄로 빌드 타임에 HTML을 미리 생성하도록 바꿨습니다.

\`\`\`tsx
// Before — 매 요청마다 서버에서 생성
export default async function GuidePage() { ... }

// After — 빌드 타임에 한 번만 생성
export const revalidate = false;
export default async function GuidePage() { ... }
\`\`\`

효과가 있었습니다. SSR cold start가 사라졌습니다. 하지만 503은 여전히 산발적으로 발생했습니다.

### 두 번째 가설: 번들 비대화

블로그 포스트 데이터가 단일 파일(\`posts.ts\`)에 3,574줄로 쌓여 있었습니다. Workers는 번들 크기가 클수록 초기 로딩에 더 많은 리소스를 씁니다.

**Phase 2**: 콘텐츠를 slug별 파일로 분리하고 content-map으로 lazy하게 참조하도록 리팩터링했습니다. 메타데이터 파일은 83줄로 줄었습니다.

**Phase 3**: \`sitemap.ts\`에 \`new Date()\` 호출이 있었습니다. Workers 환경에서 요청마다 새 Date 인스턴스를 생성하는 건 작은 비용이지만, 빌드 타임 상수로 교체했습니다.

\`\`\`tsx
// Before
lastModified: new Date()

// After
const BUILD_DATE = '2026-03-19';
lastModified: BUILD_DATE
\`\`\`

**Phase 4**: 가이드와 블로그 페이지 내부의 \`<Link>\` 컴포넌트에 \`prefetch={false}\`를 추가했습니다.

4단계를 거쳤는데도 503이 계속됐습니다. 빈도는 줄었지만 완전히 사라지지 않았습니다. 무언가를 놓치고 있었습니다.

---

## Playwright 테스트가 답을 알려줬다

막막한 상황에서 Playwright 자동화 테스트를 활용했습니다. 페이지를 방문하면서 브라우저 콘솔 메시지를 수집하도록 했습니다.

\`/guides/env\` 페이지를 방문하자 콘솔에 이것이 찍혔습니다:

\`\`\`
GET /showcase?_rsc=13zrp  503
GET /blog?_rsc=13zrp      503
GET /pricing?_rsc=13zrp   503
GET /feedback?_rsc=13zrp  503
GET /?_rsc=13zrp          503
GET /demo?_rsc=13zrp      503
\`\`\`

6건의 503. 그런데 사용자는 \`/guides/env\`를 방문했을 뿐입니다. \`/pricing\`을 클릭한 것도, \`/blog\`로 이동한 것도 아닙니다.

\`_rsc=\` 쿼리 파라미터가 힌트였습니다.

> **WARNING:** \`?_rsc=\` 쿼리 파라미터가 붙은 요청은 Next.js가 자동으로 발사하는 RSC(React Server Component) payload prefetch 요청입니다. 사용자가 링크를 클릭하기 전에 미리 서버에서 컴포넌트 데이터를 받아오는 것입니다. 이 요청들은 네트워크 탭에서는 잘 보이지 않을 수 있지만, 콘솔 오류로는 나타납니다.

## Next.js Link prefetch의 실제 동작 방식

Next.js \`<Link>\` 컴포넌트는 [Intersection Observer API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)를 활용합니다. 링크가 뷰포트(사용자 화면)에 보이는 순간, 그 링크의 목적지 페이지를 미리 가져오기 시작합니다. 사용자가 클릭하면 이미 데이터가 준비되어 있어 페이지 전환이 빠르게 느껴집니다.

이건 일반적인 환경에서는 훌륭한 UX 최적화입니다. 문제는 Linkmap의 레이아웃 구조였습니다.

\`\`\`
사용자가 아무 페이지 방문
  → Header 렌더링 (Link 33개 — 데스크톱 nav + 모바일 Sheet + 인증 메뉴)
  → Footer 렌더링 (Link 12개)
  → Landing 컴포넌트 (Link 11개, 홈 페이지일 경우)
  → 총 56개 Link 중 52개가 자동 prefetch 활성화
  → 52개 RSC payload 요청이 동시에 발사
  → Cloudflare Workers에 과부하
  → 503 Worker exceeded resource limits
\`\`\`

Header와 Footer는 **모든 페이지**에 존재합니다. 즉 사용자가 어느 페이지를 방문하든 매번 동일한 요청 폭풍이 일어난다는 뜻입니다.

| 컴포넌트 | Link 수 | prefetch 전 동시 요청 |
|----------|--------|--------------------|
| header.tsx (데스크톱 nav) | 9 | 9 |
| header.tsx (인증 메뉴) | 7 | 7 |
| header.tsx (모바일 Sheet) | 15 | 15 |
| footer.tsx | 12 | 10 |
| 랜딩 컴포넌트들 | 11 | 11 |
| **합계** | **54+** | **52** |

Phase 4에서 가이드/블로그 내부 링크에만 \`prefetch={false}\`를 적용했습니다. 그 페이지들 자체의 prefetch는 차단했지만, **Header와 Footer**에서 발사되는 요청은 전혀 손대지 않았습니다. 그래서 503이 계속됐던 것입니다.

---

## Phase 5: 근본 해결 — prefetch={false} 전체 적용

해결은 단순했습니다. Header, Footer, 랜딩 컴포넌트의 모든 \`<Link>\`에 \`prefetch={false}\`를 추가했습니다.

\`\`\`tsx
// Before
<Link href="/pricing">가격</Link>
<Link href="/blog">블로그</Link>
<Link href="/guides">가이드</Link>

// After
<Link href="/pricing" prefetch={false}>가격</Link>
<Link href="/blog" prefetch={false}>블로그</Link>
<Link href="/guides" prefetch={false}>가이드</Link>
\`\`\`

수정 대상 파일과 수정한 Link 수:

| 파일 | 수정 Link 수 |
|------|------------|
| \`header.tsx\` | 31개 |
| \`footer.tsx\` | 10개 |
| \`hero-section.tsx\` | 3개 |
| \`cta-section.tsx\` | 2개 |
| \`connection-dashboard.tsx\` | 1개 |
| 기타 랜딩 컴포넌트 | 5개 |

적용 후 Playwright 테스트를 다시 실행했습니다. 콘솔에 \`_rsc=\` 503이 하나도 뜨지 않았습니다. **RSC 동시 요청 52건 → 0건.**

> **TIP:** Cloudflare Workers 환경에서 Next.js를 배포한다면 Header, Footer, 전역 레이아웃 컴포넌트의 \`<Link>\`부터 \`prefetch={false}\`를 적용하세요. 이 컴포넌트들은 모든 페이지에 공통으로 존재하므로 링크 수가 많을수록 prefetch 요청이 누적됩니다.

## prefetch를 끄면 느려지지 않나?

당연히 드는 의문입니다. prefetch의 목적 자체가 페이지 전환 속도를 높이는 것이니까요.

결론부터 말하면, 이 환경에서는 **prefetch를 끄는 것이 더 빠릅니다**.

prefetch가 켜져 있으면:
- 페이지 방문 시 50건 이상의 요청이 Workers에 동시 도달
- Workers 과부하 → 일부 요청 503
- 사용자 클릭 시 해당 페이지 요청도 503이 될 수 있음

prefetch가 꺼져 있으면:
- 사용자가 실제로 클릭한 링크에 대해서만 요청 발생
- 정적화된 페이지는 Cloudflare CDN 캐시에서 즉시 응답
- 503 없이 안정적으로 페이지 전환

Cloudflare Workers는 전 세계 300개 이상의 엣지 노드를 통해 정적 콘텐츠를 캐시합니다. 정적화된 페이지라면 Workers까지 도달하지 않고 CDN에서 바로 응답합니다. prefetch의 속도 이점보다 CDN 캐시의 응답 속도가 더 빠를 수 있습니다.

## Workers 환경에서 배운 것들

이 경험을 통해 정리된 교훈입니다.

**1. Next.js의 기본값은 일반 서버 환경 기준이다**

Next.js는 Vercel이나 Node.js 서버를 기본 배포 대상으로 설계되었습니다. Workers처럼 CPU 시간이 엄격하게 제한되고 동시 처리에 제약이 있는 환경에서는 기본값이 최선이 아닐 수 있습니다. \`prefetch\`, \`revalidate\`, 번들 크기 모두 환경에 맞게 조정이 필요합니다.

**2. \`new Date()\` 같은 런타임 계산도 쌓이면 비용이다**

\`new Date()\`는 미세한 비용입니다. 하지만 Workers에서는 sitemap이 매 요청마다 \`new Date()\`를 호출했고, 이것이 CPU 시간에 영향을 줍니다. 빌드 타임에 고정할 수 있는 값은 고정하는 것이 맞습니다.

**3. Playwright는 재현하기 어려운 버그를 가시화한다**

"가끔 503이 뜬다"는 리포트만으로는 원인을 찾기 어렵습니다. Playwright로 콘솔 메시지를 수집하니 정확히 어떤 요청이, 어떤 순서로, 어떤 오류를 발생시키는지가 드러났습니다. 자동화 테스트는 기능 검증뿐 아니라 **진단 도구**로도 쓸 수 있습니다.

**4. Header/Footer는 가장 먼저 점검해야 하는 곳이다**

모든 페이지에 공통으로 렌더링되는 컴포넌트입니다. 이곳의 성능 문제는 사이트 전체에 영향을 미칩니다. prefetch뿐 아니라 이 컴포넌트들의 번들 크기, 서버 호출, 렌더링 비용을 주기적으로 점검할 필요가 있습니다. [Linkmap 서비스 카탈로그](https://www.linkmap.biz/services)에서 배포와 관련된 외부 서비스들을 확인해보세요.

## Workers 환경 배포 체크리스트

Cloudflare Workers + Next.js 조합을 사용할 때 참고할 수 있는 체크리스트입니다.

- [x] 공개 페이지 및 가이드 정적화 (\`revalidate = false\`)
- [x] 빌드 타임 고정 가능한 값은 상수로 처리 (\`new Date()\` 제거)
- [x] Header, Footer, 전역 레이아웃 Link → \`prefetch={false}\`
- [x] 가이드/블로그 내부 Link → \`prefetch={false}\`
- [ ] 번들 크기 정기 점검 (데이터 파일 분리, lazy import)
- [ ] Playwright 또는 콘솔 모니터링으로 \`?_rsc=\` 요청 정기 확인

> **TRY:** 비슷한 문제를 겪고 있다면 브라우저 개발자 도구 Network 탭에서 \`_rsc\`로 필터링해 보세요. prefetch 요청이 몇 건인지, 그 중 오류가 있는지 바로 확인할 수 있습니다. Linkmap으로 만든 프로젝트의 서비스 연결 상태는 [Linkmap](https://www.linkmap.biz)에서 시각화해 볼 수 있습니다. [Linkmap 배포 가이드](/guides/deploy)에서 Cloudflare Workers 배포 전반을 다룹니다.

---

*Cloudflare 연결 전반은 [Cloudflare 연결 가이드](/guides/cloudflare)에서, 이 시리즈의 첫 번째 이야기는 [ERP 담당자의 Linkmap 개발기 ① — 코드는 안 바꿨는데 서비스가 안 된다](/blog/linkmap-dev-story-1-infra-battle)에서 읽을 수 있습니다.*`;
