import { describe, it, expect } from 'vitest';
import {
  scanFilesForServices,
  scanPackagesForServices,
  mergeDetections,
} from '../service-signatures';

const slugs = (r: { slug: string }[]) => r.map((x) => x.slug).sort();

describe('scanFilesForServices — 바이브코더가 실제로 쓰는 CDN 태그', () => {
  // AI가 만들어준 페이지는 빌드 도구 없이 CDN 스크립트를 붙이는 경우가 많다.
  // npm 패키지 기반 감지만으로는 이런 사이트를 전혀 알아보지 못한다.
  it('finds Supabase loaded from a CDN', () => {
    const html = `<script type="module">
      import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
      const db = createClient('https://abcdefg.supabase.co', 'anon-key');
    </script>`;
    const found = scanFilesForServices([{ path: 'index.html', content: html }]);
    expect(slugs(found)).toContain('supabase');
    expect(found[0].foundIn).toEqual(['index.html']);
  });

  it('finds Google Analytics from the gtag snippet', () => {
    const html = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC12345"></script>
      <script>gtag('config', 'G-ABC12345');</script>`;
    expect(slugs(scanFilesForServices([{ path: 'index.html', content: html }]))).toContain('ga4');
  });

  it('finds several services in one page', () => {
    const html = `
      <script src="https://js.stripe.com/v3/"></script>
      <script src="https://t1.daumcdn.net/kas/static/ba.min.js"></script>
      <script src="https://www.clarity.ms/tag/abc"></script>`;
    expect(slugs(scanFilesForServices([{ path: 'index.html', content: html }])))
      .toEqual(['clarity', 'kakao-adfit', 'stripe']);
  });

  it('reports where each service was found', () => {
    const found = scanFilesForServices([
      { path: 'index.html', content: '<script src="https://js.tosspayments.com/v1"></script>' },
      { path: 'pay.js', content: 'TossPayments("ck_test")' },
    ]);
    expect(found).toHaveLength(1);
    expect(found[0].foundIn.sort()).toEqual(['index.html', 'pay.js']);
  });

  it('ignores files that cannot contain service calls', () => {
    const found = scanFilesForServices([
      { path: 'logo.png', content: 'js.stripe.com' },
      { path: 'style.css', content: 'api.openai.com' },
    ]);
    expect(found).toEqual([]);
  });

  // 오탐은 "추측으로 채우지 않는다"는 이 기능의 전제를 직접 깬다.
  // 아래는 전부 바이브코더 페이지에서 흔한 형태다.
  it('does not mistake a supabase.com link for using Supabase', () => {
    const html = '<a href="https://supabase.com/docs">Supabase 문서 보기</a>';
    expect(scanFilesForServices([{ path: 'index.html', content: html }])).toEqual([]);
  });

  it('does not mistake an order number for a GA4 measurement ID', () => {
    const html = '<p>주문번호: G-20240115ABC</p>';
    expect(scanFilesForServices([{ path: 'index.html', content: html }])).toEqual([]);
  });

  it('does not mistake a user-defined initializeApp() for Firebase', () => {
    const js = 'function initializeApp() { console.info("내 앱 시작"); }\ninitializeApp();';
    expect(scanFilesForServices([{ path: 'app.js', content: js }])).toEqual([]);
  });

  it('still finds the real thing after tightening', () => {
    const real = `
      <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
      <script>const db = createClient('https://abcdefg.supabase.co', 'key');</script>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC12345"></script>`;
    expect(slugs(scanFilesForServices([{ path: 'index.html', content: real }])))
      .toEqual(['firebase', 'ga4', 'supabase']);
  });

  it('finds nothing in a plain static page', () => {
    const html = '<h1>안녕하세요</h1><p>제 소개 페이지입니다.</p>';
    expect(scanFilesForServices([{ path: 'index.html', content: html }])).toEqual([]);
  });
});

describe('scanPackagesForServices — 빌드형 저장소', () => {
  it('maps dependencies to services', () => {
    const found = scanPackagesForServices(
      { '@supabase/supabase-js': '2.0.0', react: '19.0.0' },
      { '@sentry/react': '8.0.0' },
    );
    expect(slugs(found)).toEqual(['sentry', 'supabase']);
    expect(found.find((f) => f.slug === 'supabase')?.foundIn[0]).toContain('@supabase/supabase-js');
  });

  it('tolerates a missing package.json', () => {
    expect(scanPackagesForServices(undefined)).toEqual([]);
  });
});

describe('mergeDetections', () => {
  it('combines evidence for the same service instead of duplicating it', () => {
    const merged = mergeDetections(
      scanFilesForServices([{ path: 'index.html', content: 'https://abcdefg.supabase.co/rest/v1' }]),
      scanPackagesForServices({ '@supabase/supabase-js': '2' }),
    );
    expect(merged).toHaveLength(1);
    expect(merged[0].slug).toBe('supabase');
    expect(merged[0].foundIn.length).toBe(2);
  });

  it('sorts results so the list is stable for the user', () => {
    const merged = mergeDetections(
      scanFilesForServices([
        { path: 'a.html', content: 'https://js.stripe.com/v3/' },
        { path: 'b.html', content: 'https://api.mapbox.com/x' },
      ]),
    );
    expect(slugs(merged)).toEqual(['mapbox', 'stripe']);
  });
});
