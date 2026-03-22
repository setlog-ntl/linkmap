/**
 * JSON-LD 검증 스크립트 — 빌드 타임에 모든 JSON-LD 생성 함수의 필수 필드를 검증
 * Usage: npx tsx scripts/validate-jsonld.ts
 */

import {
  generateWebAppJsonLd,
  generateGuideJsonLd,
  generateBlogJsonLd,
  generateServiceJsonLd,
  generateFaqJsonLd,
  generatePricingJsonLd,
  generateItemListJsonLd,
  generateGlossaryJsonLd,
  generateBreadcrumbJsonLd,
  generateShowcaseJsonLd,
} from '../src/lib/seo/json-ld';

interface ValidationResult {
  name: string;
  passed: boolean;
  errors: string[];
}

function validate(name: string, data: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];

  // @graph가 있는 경우 최상위에서 @context 확인, 개별 아이템은 @type 확인
  if (data['@graph']) {
    if (data['@context'] !== 'https://schema.org') {
      errors.push('@context가 누락되었거나 올바르지 않습니다');
    }
    const graph = data['@graph'] as Record<string, unknown>[];
    for (let i = 0; i < graph.length; i++) {
      if (!graph[i]['@type']) {
        errors.push(`@graph[${i}]에 @type이 누락되었습니다`);
      }
    }
  } else {
    if (data['@context'] !== 'https://schema.org') {
      errors.push('@context가 누락되었거나 올바르지 않습니다');
    }
    if (!data['@type']) {
      errors.push('@type이 누락되었습니다');
    }
  }

  // name 또는 headline 필수 (BreadcrumbList, FAQPage 제외)
  const type = data['@type'] as string | undefined;
  if (type && !['BreadcrumbList', 'FAQPage', 'DefinedTermSet', 'ItemList'].includes(type)) {
    if (!data['name'] && !data['headline']) {
      errors.push('name 또는 headline이 누락되었습니다');
    }
  }

  return { name, passed: errors.length === 0, errors };
}

// 테스트 데이터로 모든 생성 함수 호출
const results: ValidationResult[] = [
  validate('WebApp', generateWebAppJsonLd()),
  validate('Guide', generateGuideJsonLd({
    slug: 'test-guide',
    title: '테스트 가이드',
    description: '테스트 설명',
  })),
  validate('Blog', generateBlogJsonLd({
    slug: 'test-post',
    title: '테스트 포스트',
    description: '테스트 설명',
    publishedAt: '2026-01-01',
  })),
  validate('Service', generateServiceJsonLd({
    name: '테스트 서비스',
    slug: 'test-service',
    description: '테스트 설명',
  })),
  validate('FAQ', generateFaqJsonLd([
    { question: '질문?', answer: '답변.' },
  ])),
  validate('Pricing', generatePricingJsonLd()),
  validate('ItemList', generateItemListJsonLd([
    { name: '아이템 1', url: 'https://example.com/1' },
  ])),
  validate('Glossary', generateGlossaryJsonLd([
    { term: '용어', definition: '정의' },
  ])),
  validate('Breadcrumb', generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '테스트', href: '/test' },
  ])),
  validate('Showcase', generateShowcaseJsonLd()),
];

// 결과 출력
let hasError = false;
for (const r of results) {
  if (r.passed) {
    console.log(`  ✓ ${r.name}`);
  } else {
    hasError = true;
    console.error(`  ✗ ${r.name}`);
    for (const e of r.errors) {
      console.error(`    - ${e}`);
    }
  }
}

if (hasError) {
  console.error('\nJSON-LD 검증 실패');
  process.exit(1);
} else {
  console.log('\n모든 JSON-LD 검증 통과');
}
